import type {
  Reference,
  ReferenceCache,
  TFile,
  TFolder
} from 'obsidian';
import type { FileChange } from 'obsidian-dev-utils/obsidian/FileChange';
import type { PathOrAbstractFile } from 'obsidian-dev-utils/obsidian/FileSystem';
import type { CanvasData } from 'obsidian/canvas.d.ts';

import {
  App,
  Notice,
  setIcon,
  Vault
} from 'obsidian';
import {
  abortSignalAny,
  INFINITE_TIMEOUT
} from 'obsidian-dev-utils/AbortController';
import { throwExpression } from 'obsidian-dev-utils/Error';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { toJson } from 'obsidian-dev-utils/ObjectUtils';
import { applyFileChanges } from 'obsidian-dev-utils/obsidian/FileChange';
import {
  getFile,
  getPath,
  isCanvasFile,
  isNote
} from 'obsidian-dev-utils/obsidian/FileSystem';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import {
  extractLinkFile,
  updateLink
} from 'obsidian-dev-utils/obsidian/Link';
import { loop } from 'obsidian-dev-utils/obsidian/Loop';
import {
  getAllLinks,
  getBacklinksForFileSafe,
  getCacheSafe,
  registerFiles,
  unregisterFiles
} from 'obsidian-dev-utils/obsidian/MetadataCache';
import { confirm } from 'obsidian-dev-utils/obsidian/Modals/Confirm';
import { addToQueue } from 'obsidian-dev-utils/obsidian/Queue';
import { referenceToFileChange } from 'obsidian-dev-utils/obsidian/Reference';
import {
  copySafe,
  getSafeRenamePath,
  process,
  renameSafe
} from 'obsidian-dev-utils/obsidian/Vault';
import { deleteEmptyFolderHierarchy } from 'obsidian-dev-utils/obsidian/VaultEx';
import {
  dirname,
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';

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

  const notice = new Notice(t(($) => $.notice.collectingAttachments, { noteFilePath: note.path }));

  const attachmentsMap = new Map<string, string>();
  const isCanvas = isCanvasFile(app, note);

  const attachmentMoveResults: AttachmentMoveResult[] = [];
  const fakeFiles: TFile[] = [];

  await applyFileChanges(
    app,
    note,
    async (abortSignal2, content) => {
      abortSignal2.throwIfAborted();
      const cache = await getCacheSafe(app, note);
      abortSignal2.throwIfAborted();

      const cachedContent = await app.vault.cachedRead(note);
      abortSignal2.throwIfAborted();

      if (ctx.isAborted) {
        return [];
      }

      if (content !== cachedContent) {
        return null;
      }

      if (!cache) {
        return [];
      }

      const links = isCanvas ? await getCanvasLinks(app, note) : getAllLinks(cache);
      abortSignal2.throwIfAborted();
      const changes: FileChange[] = [];

      for (const link of links) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (ctx.isAborted) {
          return changes;
        }

        const attachmentMoveResult = await prepareAttachmentToMove(plugin, link, note.path, note.path);
        abortSignal2.throwIfAborted();
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
        abortSignal2.throwIfAborted();
        if (backlinks.keys().length > 1) {
          const backlinksSorted = backlinks.keys().sort((a, b) => a.localeCompare(b));
          const backlinksStr = backlinksSorted.map((backlink) => `- ${backlink}`).join('\n');

          async function applyCollectAttachmentUsedByMultipleNotesMode(
            collectAttachmentUsedByMultipleNotesMode: CollectAttachmentUsedByMultipleNotesMode
          ): Promise<boolean> {
            abortSignal2.throwIfAborted();
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
                // eslint-disable-next-line require-atomic-updates
                attachmentMoveResult.newAttachmentPath = await copySafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
                break;
              case CollectAttachmentUsedByMultipleNotesMode.Move:
                registerMoveAttachment();
                abortSignal2.throwIfAborted();
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
            abortSignal2.throwIfAborted();
            continue;
          }
        } else {
          abortSignal2.throwIfAborted();
          registerMoveAttachment();
          abortSignal2.throwIfAborted();
        }

        function registerMoveAttachment(): void {
          abortSignal2.throwIfAborted();
          if (!attachmentMoveResult) {
            return;
          }

          attachmentMoveResult.newAttachmentPath = getSafeRenamePath(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
          const fakeFile = getFile(app, attachmentMoveResult.newAttachmentPath, true);
          fakeFiles.push(fakeFile);
          registerFiles(app, [fakeFile]);
          attachmentMoveResults.push(attachmentMoveResult);
        }

        attachmentsMap.set(attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);

        if (!isCanvas) {
          const newContent = updateLink({
            app,
            link,
            newSourcePathOrFile: note,
            newTargetPathOrFile: attachmentMoveResult.newAttachmentPath,
            oldTargetPathOrFile: attachmentMoveResult.oldAttachmentPath
          });

          changes.push(referenceToFileChange(link, newContent));
        }
      }

      return changes;
    },
    {
      timeoutInMilliseconds: getTimeoutInMilliseconds(plugin)
    }
  );

  unregisterFiles(app, fakeFiles);

  for (const attachmentMoveResult of attachmentMoveResults) {
    await renameSafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
    abortSignal.throwIfAborted();
    await deleteEmptyFolderHierarchy(app, dirname(attachmentMoveResult.oldAttachmentPath));
    abortSignal.throwIfAborted();
  }

  if (isCanvas) {
    await process(app, note, (abortSignal2, content) => {
      abortSignal2.throwIfAborted();
      const canvasData = JSON.parse(content) as CanvasData;
      for (const node of canvasData.nodes) {
        if (node.type !== 'file') {
          continue;
        }
        const newPath = attachmentsMap.get(node.file);
        if (!newPath) {
          continue;
        }
        node.file = newPath;
      }
      return toJson(canvasData);
    }, {
      timeoutInMilliseconds: plugin.settings.getTimeoutInMilliseconds()
    });
  }

  notice.hide();
}

export function collectAttachmentsCurrentFolder(plugin: Plugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!isNoteEx(plugin, note)) {
    return false;
  }

  if (!checking) {
    addToQueue(
      plugin.app,
      (abortSignal) => collectAttachmentsInFolder(plugin, note?.parent ?? throwExpression(new Error('Parent folder not found')), abortSignal),
      plugin.abortSignal,
      getTimeoutInMilliseconds(plugin)
    );
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

    addToQueue(plugin.app, (abortSignal) => collectAttachments(plugin, note, {}, abortSignal), plugin.abortSignal, getTimeoutInMilliseconds(plugin));
  }

  return true;
}

export function collectAttachmentsEntireVault(plugin: Plugin): void {
  addToQueue(
    plugin.app,
    (abortSignal) => collectAttachmentsInFolder(plugin, plugin.app.vault.getRoot(), abortSignal),
    plugin.abortSignal,
    getTimeoutInMilliseconds(plugin)
  );
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
    if (isNoteEx(plugin, child)) {
      noteFiles.push(child as TFile);
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
  oldNotePath: string
): Promise<AttachmentMoveResult | null> {
  const app = plugin.app;

  const oldAttachmentFile = extractLinkFile(app, link, oldNotePath);
  if (!oldAttachmentFile) {
    console.warn(`Skipping collecting attachment ${link.link} as it could not be resolved.`);
    return null;
  }

  if (isNoteEx(plugin, oldAttachmentFile)) {
    console.warn(`Skipping collecting attachment ${oldAttachmentFile.path} as it is a note.`);
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
          app: plugin.app,
          attachmentFileContent,
          attachmentFileStat: oldAttachmentFile.stat,
          noteFilePath: newNotePath,
          originalAttachmentFileName: oldAttachmentFile.name
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
