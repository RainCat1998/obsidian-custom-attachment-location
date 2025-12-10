import type {
  Reference,
  ReferenceCache,
  TFolder
} from 'obsidian';
import type { PathOrAbstractFile } from 'obsidian-dev-utils/obsidian/FileSystem';
import type { MaybeReturn } from 'obsidian-dev-utils/Type';
import type { CanvasData } from 'obsidian/canvas.d.ts';

import {
  App,
  Notice,
  setIcon,
  TFile,
  Vault
} from 'obsidian';
import {
  abortSignalAny,
  INFINITE_TIMEOUT
} from 'obsidian-dev-utils/AbortController';
import { throwExpression } from 'obsidian-dev-utils/Error';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import {
  getPath,
  isCanvasFile,
  isNote
} from 'obsidian-dev-utils/obsidian/FileSystem';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import {
  editLinks,
  extractLinkFile,
  updateLink
} from 'obsidian-dev-utils/obsidian/Link';
import { loop } from 'obsidian-dev-utils/obsidian/Loop';
import {
  getAllLinks,
  getBacklinksForFileSafe,
  getCacheSafe
} from 'obsidian-dev-utils/obsidian/MetadataCache';
import { confirm } from 'obsidian-dev-utils/obsidian/Modals/Confirm';
import { addToQueue } from 'obsidian-dev-utils/obsidian/Queue';
import {
  copySafe,
  renameSafe
} from 'obsidian-dev-utils/obsidian/Vault';
import {
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';
import { isReferenceCache } from 'obsidian-typings/implementations';

import type { Plugin } from './Plugin.ts';

import {
  getAttachmentFolderFullPathForPath,
  getGeneratedAttachmentFileBaseName
} from './AttachmentPath.ts';
import { selectMode } from './CollectAttachmentUsedByMultipleNotesModal.ts';
import { CollectAttachmentUsedByMultipleNotesMode } from './PluginSettings.ts';
import {
  hasPromptToken,
  Substitutions
} from './Substitutions.ts';
import { ActionContext } from './TokenEvaluatorContext.ts';

interface AttachmentMoveResult {
  newAttachmentPath: string;
  oldAttachmentPath: string;
}

interface CollectAttachmentContext {
  collectAttachmentUsedByMultipleNotesMode?: CollectAttachmentUsedByMultipleNotesMode;
  isAborted?: boolean;
}

export async function collectAttachments(
  plugin: Plugin,
  note: TFile,
  ctx: CollectAttachmentContext,
  abortSignal: AbortSignal
): Promise<void> {
  abortSignal.throwIfAborted();
  const app = plugin.app;

  if (ctx.isAborted) {
    return;
  }

  const notice = new Notice(t(($) => $.notice.collectingAttachments, { noteFilePath: note.path }), 0);

  const isCanvas = isCanvasFile(app, note);

  const oldAttachmentPaths = new Set<string>();

  const cache = await getCacheSafe(app, note);
  abortSignal.throwIfAborted();

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Could be changed in await call.
  if (ctx.isAborted) {
    return;
  }

  if (!cache) {
    return;
  }

  const links = isCanvas ? await getCanvasLinks(app, note) : getAllLinks(cache);
  abortSignal.throwIfAborted();

  for (const link of links) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Could be changed in await call.
    if (ctx.isAborted) {
      return;
    }

    const attachmentMoveResult = await prepareAttachmentToMove(plugin, link, note.path, note.path, oldAttachmentPaths);
    abortSignal.throwIfAborted();
    if (!attachmentMoveResult) {
      continue;
    }

    if (plugin.settings.isExcludedFromAttachmentCollecting(attachmentMoveResult.oldAttachmentPath)) {
      console.warn(`Skipping collecting attachment ${attachmentMoveResult.oldAttachmentPath} as it is excluded from attachment collecting.`);
      continue;
    }

    const backlinks = await getBacklinksForFileSafe(app, attachmentMoveResult.oldAttachmentPath, {
      timeoutInMilliseconds: plugin.settings.getTimeoutInMilliseconds()
    });
    abortSignal.throwIfAborted();
    if (backlinks.keys().length > 1) {
      const backlinksSorted = backlinks.keys().sort((a, b) => a.localeCompare(b));
      const backlinksStr = backlinksSorted.map((backlink) => `- ${backlink}`).join('\n');

      async function applyCollectAttachmentUsedByMultipleNotesMode(
        collectAttachmentUsedByMultipleNotesMode: CollectAttachmentUsedByMultipleNotesMode
      ): Promise<boolean> {
        abortSignal.throwIfAborted();
        if (!attachmentMoveResult) {
          return false;
        }

        switch (collectAttachmentUsedByMultipleNotesMode) {
          case CollectAttachmentUsedByMultipleNotesMode.Cancel:
            console.error(
              `Cancelling collecting attachments, as attachment ${attachmentMoveResult.oldAttachmentPath} is referenced by multiple notes.\n${backlinksStr}`
            );
            new Notice(t(($) => $.notice.collectingAttachmentsCancelled));
            ctx.isAborted = true;
            return false;
          case CollectAttachmentUsedByMultipleNotesMode.Copy:
            // eslint-disable-next-line require-atomic-updates -- Ignore possible race condition.
            attachmentMoveResult.newAttachmentPath = await copySafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
            await editLinks(app, note, (link2): MaybeReturn<string> => {
              const linkFile = extractLinkFile(app, link2, note);
              if (linkFile?.path !== attachmentMoveResult.oldAttachmentPath) {
                return;
              }
              return updateLink({
                app,
                link: link2,
                newSourcePathOrFile: note,
                newTargetPathOrFile: attachmentMoveResult.newAttachmentPath,
                oldSourcePathOrFile: note,
                oldTargetPathOrFile: attachmentMoveResult.oldAttachmentPath
              });
            });
            break;
          case CollectAttachmentUsedByMultipleNotesMode.Move:
            await registerMoveAttachment();
            abortSignal.throwIfAborted();
            break;
          case CollectAttachmentUsedByMultipleNotesMode.Prompt: {
            const { mode, shouldUseSameActionForOtherProblematicAttachments } = await selectMode(
              app,
              attachmentMoveResult.oldAttachmentPath,
              backlinksSorted
            );
            if (shouldUseSameActionForOtherProblematicAttachments) {
              ctx.collectAttachmentUsedByMultipleNotesMode = mode;
            }
            return applyCollectAttachmentUsedByMultipleNotesMode(mode);
          }
          case CollectAttachmentUsedByMultipleNotesMode.Skip:
            console.warn(
              `Skipping collecting attachment ${attachmentMoveResult.oldAttachmentPath} as it is referenced by multiple notes.\n${backlinksStr}`
            );
            return false;
          default:
            throw new Error(`Unknown collect attachment used by multiple notes mode: ${plugin.settings.collectAttachmentUsedByMultipleNotesMode}`);
        }

        return true;
      }

      if (
        !await applyCollectAttachmentUsedByMultipleNotesMode(
          ctx.collectAttachmentUsedByMultipleNotesMode ?? plugin.settings.collectAttachmentUsedByMultipleNotesMode
        )
      ) {
        abortSignal.throwIfAborted();
        continue;
      }
    } else {
      abortSignal.throwIfAborted();
      await registerMoveAttachment();
      abortSignal.throwIfAborted();
    }

    async function registerMoveAttachment(): Promise<void> {
      abortSignal.throwIfAborted();
      if (!attachmentMoveResult) {
        return;
      }

      // eslint-disable-next-line require-atomic-updates -- Ignore possible race condition.
      attachmentMoveResult.newAttachmentPath = await renameSafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
    }
  }

  notice.hide();
}

export function collectAttachmentsCurrentFolder(plugin: Plugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!isNoteEx(plugin, note)) {
    return false;
  }

  if (!checking) {
    addToQueue({
      abortSignal: plugin.abortSignal,
      app: plugin.app,
      operationFn: (abortSignal) => collectAttachmentsInFolder(plugin, note?.parent ?? throwExpression(new Error('Parent folder not found')), abortSignal),
      operationName: 'Collect attachments in current folder',
      timeoutInMilliseconds: getTimeoutInMilliseconds(plugin)
    });
  }

  return true;
}

export function collectAttachmentsCurrentNote(plugin: Plugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!note || !isNoteEx(plugin, note)) {
    return false;
  }

  if (!checking) {
    if (plugin.settings.isPathIgnored(note.path)) {
      new Notice(t(($) => $.notice.notePathIsIgnored));
      console.warn(`Cannot collect attachments in the note as note path is ignored: ${note.path}.`);
      return true;
    }

    addToQueue({
      abortSignal: plugin.abortSignal,
      app: plugin.app,
      operationFn: (abortSignal) => collectAttachments(plugin, note, {}, abortSignal),
      operationName: 'Collect attachments in current note',
      timeoutInMilliseconds: getTimeoutInMilliseconds(plugin)
    });
  }

  return true;
}

export function collectAttachmentsEntireVault(plugin: Plugin): void {
  addToQueue({
    abortSignal: plugin.abortSignal,
    app: plugin.app,
    operationFn: (abortSignal) => collectAttachmentsInFolder(plugin, plugin.app.vault.getRoot(), abortSignal),
    operationName: 'Collect attachments in entire vault',
    timeoutInMilliseconds: getTimeoutInMilliseconds(plugin)
  });
}

export async function collectAttachmentsInFolder(plugin: Plugin, folder: TFolder, abortSignal: AbortSignal): Promise<void> {
  abortSignal.throwIfAborted();
  if (
    !await confirm({
      app: plugin.app,
      cancelButtonText: t(($) => $.obsidianDevUtils.buttons.cancel),
      message: createFragment((f) => {
        f.appendText(t(($) => $.attachmentCollector.confirm.part1));
        f.appendText(' ');
        appendCodeBlock(f, folder.path);
        f.appendText(' ');
        f.appendText(t(($) => $.attachmentCollector.confirm.part2));
        f.createEl('br');
        f.appendText(t(($) => $.attachmentCollector.confirm.part3));
      }),
      okButtonText: t(($) => $.obsidianDevUtils.buttons.ok),
      title: createFragment((f) => {
        setIcon(f.createSpan(), 'lucide-alert-triangle');
        f.appendText(' ');
        f.appendText(t(($) => $.menuItems.collectAttachmentsInFolder));
      })
    })
  ) {
    abortSignal.throwIfAborted();
    return;
  }
  plugin.consoleDebug(`Collect attachments in folder: ${folder.path}`);
  const noteFiles: TFile[] = [];
  Vault.recurseChildren(folder, (child) => {
    if (isNoteEx(plugin, child) && child instanceof TFile) {
      noteFiles.push(child);
    }
  });

  noteFiles.sort((a, b) => a.path.localeCompare(b.path));

  const ctx: CollectAttachmentContext = {};
  const abortController = new AbortController();

  const combinedAbortSignal = abortSignalAny(abortController.signal, plugin.abortSignal);

  await loop({
    abortSignal: combinedAbortSignal,
    buildNoticeMessage: (noteFile, iterationStr) => t(($) => $.attachmentCollector.progressBar.message, { iterationStr, noteFilePath: noteFile.path }),
    items: noteFiles,
    processItem: async (noteFile) => {
      combinedAbortSignal.throwIfAborted();
      if (plugin.settings.isPathIgnored(noteFile.path)) {
        console.warn(`Cannot collect attachments in the note as note path is ignored: ${noteFile.path}.`);
        return;
      }
      await collectAttachments(plugin, noteFile, ctx, combinedAbortSignal);
      combinedAbortSignal.throwIfAborted();
      if (ctx.isAborted) {
        abortController.abort();
      }
    },
    progressBarTitle: `${plugin.manifest.name}: ${t(($) => $.attachmentCollector.progressBar.title)}`,
    shouldContinueOnError: true,
    shouldShowProgressBar: true
  });
}

export function isNoteEx(plugin: Plugin, pathOrFile: null | PathOrAbstractFile): boolean {
  if (!pathOrFile || !isNote(plugin.app, pathOrFile)) {
    return false;
  }

  const path = getPath(plugin.app, pathOrFile);
  return plugin.settings.treatAsAttachmentExtensions.every((extension) => !path.endsWith(extension));
}

async function getCanvasLinks(app: App, canvasFile: TFile): Promise<ReferenceCache[]> {
  const canvasData = await app.vault.readJson(canvasFile.path) as CanvasData;
  const paths = canvasData.nodes.filter((node) => node.type === 'file').map((node) => node.file);
  return paths.map((path) => ({
    link: path,
    original: path,
    position: {
      end: { col: 0, line: 0, loc: 0, offset: 0 },
      start: { col: 0, line: 0, loc: 0, offset: 0 }
    }
  }));
}

function getTimeoutInMilliseconds(plugin: Plugin): number {
  return plugin.settings.collectAttachmentUsedByMultipleNotesMode === CollectAttachmentUsedByMultipleNotesMode.Prompt
      || hasPromptToken(plugin.settings.attachmentFolderPath)
      || hasPromptToken(plugin.settings.generatedAttachmentFileName)
    ? INFINITE_TIMEOUT
    : plugin.settings.getTimeoutInMilliseconds();
}

async function prepareAttachmentToMove(
  plugin: Plugin,
  link: Reference,
  newNotePath: string,
  oldNotePath: string,
  oldAttachmentPaths: Set<string>
): Promise<AttachmentMoveResult | null> {
  const app = plugin.app;

  const oldAttachmentFile = extractLinkFile(app, link, oldNotePath, true);

  if (!oldAttachmentFile) {
    return null;
  }

  if (isNoteEx(plugin, oldAttachmentFile)) {
    return null;
  }

  if (oldAttachmentPaths.has(oldAttachmentFile.path)) {
    return null;
  }

  oldAttachmentPaths.add(oldAttachmentFile.path);

  if (oldAttachmentFile.deleted) {
    console.warn(`Skipping collecting attachment ${link.link} as it could not be resolved.`);
    return null;
  }

  const oldAttachmentPath = oldAttachmentFile.path;
  const oldAttachmentName = oldAttachmentFile.name;

  let newAttachmentName: string;

  const attachmentFileContent = await plugin.app.vault.readBinary(oldAttachmentFile);

  if (plugin.settings.shouldRenameCollectedAttachments) {
    newAttachmentName = makeFileName(
      await getGeneratedAttachmentFileBaseName(
        plugin,
        new Substitutions({
          actionContext: ActionContext.CollectAttachments,
          attachmentFileContent,
          attachmentFileStat: oldAttachmentFile.stat,
          cursorLine: isReferenceCache(link) ? link.position.start.line : 0,
          noteFilePath: newNotePath,
          originalAttachmentFileName: oldAttachmentFile.name,
          plugin
        })
      ),
      oldAttachmentFile.extension
    );
  } else {
    newAttachmentName = oldAttachmentName;
  }

  const newAttachmentFolderPath = await getAttachmentFolderFullPathForPath(
    plugin,
    ActionContext.CollectAttachments,
    newNotePath,
    newAttachmentName,
    undefined,
    attachmentFileContent,
    oldAttachmentFile.stat
  );
  const newAttachmentPath = join(newAttachmentFolderPath, newAttachmentName);

  if (oldAttachmentPath === newAttachmentPath) {
    console.warn(`Skipping collecting attachment ${oldAttachmentFile.path} as it is already in the destination folder.`);
    return null;
  }

  return {
    newAttachmentPath,
    oldAttachmentPath
  };
}
