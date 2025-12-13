import type {
  Reference,
  ReferenceCache,
  TAbstractFile
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
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import {
  getPath,
  isCanvasFile,
  isFile,
  isFolder,
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

export interface GetProperAttachmentPathOptions {
  actionContext: ActionContext;
  attachmentFile: TFile;
  noteFilePath: string;
  plugin: Plugin;
  reference: Reference;
}

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

export function collectAttachmentsEntireVault(plugin: Plugin): void {
  addToQueue({
    abortSignal: plugin.abortSignal,
    app: plugin.app,
    operationFn: (abortSignal) => collectAttachmentsInAbstractFilesImpl(plugin, [plugin.app.vault.getRoot()], abortSignal),
    operationName: t(($) => $.commands.collectAttachmentsEntireVault),
    timeoutInMilliseconds: getTimeoutInMilliseconds(plugin)
  });
}

export function collectAttachmentsInAbstractFiles(plugin: Plugin, abstractFiles: TAbstractFile[]): void {
  addToQueue({
    abortSignal: plugin.abortSignal,
    app: plugin.app,
    operationFn: (abortSignal) => collectAttachmentsInAbstractFilesImpl(plugin, abstractFiles, abortSignal),
    operationName: t(($) => $.menuItems.collectAttachmentsInFile),
    timeoutInMilliseconds: getTimeoutInMilliseconds(plugin)
  });
}

export async function getProperAttachmentPath(options: GetProperAttachmentPathOptions): Promise<null | string> {
  const attachmentFileContent = await options.plugin.app.vault.readBinary(options.attachmentFile);
  const newAttachmentName = options.plugin.settings.shouldRenameCollectedAttachments
    ? makeFileName(
      await getGeneratedAttachmentFileBaseName(
        options.plugin,
        new Substitutions({
          actionContext: options.actionContext,
          attachmentFileContent,
          attachmentFileStat: options.attachmentFile.stat,
          cursorLine: isReferenceCache(options.reference) ? options.reference.position.start.line : 0,
          noteFilePath: options.noteFilePath,
          originalAttachmentFileName: options.attachmentFile.name,
          plugin: options.plugin
        })
      ),
      options.attachmentFile.extension
    )
    : options.attachmentFile.name;

  const newAttachmentFolderPath = await getAttachmentFolderFullPathForPath(
    options.plugin,
    options.actionContext,
    options.noteFilePath,
    newAttachmentName,
    undefined,
    attachmentFileContent,
    options.attachmentFile.stat
  );
  const newAttachmentPath = join(newAttachmentFolderPath, newAttachmentName);

  if (options.attachmentFile.path === newAttachmentPath) {
    return null;
  }

  return newAttachmentPath;
}

export function isNoteEx(plugin: Plugin, pathOrFile: null | PathOrAbstractFile): boolean {
  if (!pathOrFile || !isNote(plugin.app, pathOrFile)) {
    return false;
  }

  const path = getPath(plugin.app, pathOrFile);
  return plugin.settings.treatAsAttachmentExtensions.every((extension) => !path.endsWith(extension));
}

async function collectAttachmentsInAbstractFilesImpl(plugin: Plugin, abstractFiles: TAbstractFile[], abortSignal: AbortSignal): Promise<void> {
  abortSignal.throwIfAborted();
  const singleFile: null | TFile = abstractFiles.length === 1 && isFile(abstractFiles[0]) ? abstractFiles[0] : null;

  if (singleFile && plugin.settings.isPathIgnored(singleFile.path)) {
    new Notice(t(($) => $.notice.notePathIsIgnored));
    console.warn(`Cannot collect attachments in the note as note path is ignored: ${singleFile.path}.`);
    return;
  }

  const canCollectAttachments = !!singleFile || (await confirm({
    app: plugin.app,
    cancelButtonText: t(($) => $.obsidianDevUtils.buttons.cancel),
    message: createFragment((f) => {
      f.appendText(t(($) => $.attachmentCollector.confirm.part1));
      f.createEl('br');
      f.createEl('ul', {}, (ul) => {
        for (const abstractFile of abstractFiles) {
          ul.createEl('li', {}, (li) => {
            appendCodeBlock(li, abstractFile.path);
          });
        }
      });
      f.createEl('br');
      f.appendText(t(($) => $.attachmentCollector.confirm.part2));
    }),
    okButtonText: t(($) => $.obsidianDevUtils.buttons.ok),
    title: createFragment((f) => {
      setIcon(f.createSpan(), 'lucide-alert-triangle');
      f.appendText(' ');
      f.appendText(t(($) => $.menuItems.collectAttachmentsInFiles));
    })
  }));

  if (!canCollectAttachments) {
    abortSignal.throwIfAborted();
    return;
  }
  plugin.consoleDebug(`Collect attachments in files:\n${abstractFiles.map((abstractFile) => abstractFile.path).join('\n')}`);
  const noteFilesSet = new Set<TFile>();

  for (const abstractFile of abstractFiles) {
    if (isFile(abstractFile) && isNote(plugin.app, abstractFile)) {
      noteFilesSet.add(abstractFile);
    }

    if (isFolder(abstractFile)) {
      Vault.recurseChildren(abstractFile, (child) => {
        if (isFile(child) && isNote(plugin.app, child)) {
          noteFilesSet.add(child);
        }
      });
    }
  }

  const noteFiles = Array.from(noteFilesSet);
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
  reference: Reference,
  newNotePath: string,
  oldNotePath: string,
  oldAttachmentPaths: Set<string>
): Promise<AttachmentMoveResult | null> {
  const app = plugin.app;

  const oldAttachmentFile = extractLinkFile(app, reference, oldNotePath, true);

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
    console.warn(`Skipping collecting attachment ${reference.link} as it could not be resolved.`);
    return null;
  }

  const newAttachmentPath = await getProperAttachmentPath({
    actionContext: ActionContext.CollectAttachments,
    attachmentFile: oldAttachmentFile,
    noteFilePath: newNotePath,
    plugin,
    reference
  });
  if (!newAttachmentPath) {
    console.warn(`Skipping collecting attachment ${oldAttachmentFile.path} as it is already in the destination folder.`);
    return null;
  }

  return {
    newAttachmentPath,
    oldAttachmentPath: oldAttachmentFile.path
  };
}
