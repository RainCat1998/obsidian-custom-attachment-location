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
import { throwExpression } from 'obsidian-dev-utils/Error';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { toJson } from 'obsidian-dev-utils/Object';
import { applyFileChanges } from 'obsidian-dev-utils/obsidian/FileChange';
import {
  getPath,
  isCanvasFile,
  isNote
} from 'obsidian-dev-utils/obsidian/FileSystem';
import {
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
import { referenceToFileChange } from 'obsidian-dev-utils/obsidian/Reference';
import {
  copySafe,
  process,
  renameSafe
} from 'obsidian-dev-utils/obsidian/Vault';
import { deleteEmptyFolderHierarchy } from 'obsidian-dev-utils/obsidian/VaultEx';
import {
  basename,
  dirname,
  extname,
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';

import type { Plugin } from './Plugin.ts';

import {
  getAttachmentFolderFullPathForPath,
  getPastedFileName
} from './AttachmentPath.ts';
import { Substitutions } from './Substitutions.ts';

interface AttachmentMoveResult {
  newAttachmentPath: string;
  oldAttachmentPath: string;
}

export async function collectAttachments(
  plugin: Plugin,
  note: TFile
): Promise<void> {
  const app = plugin.app;

  const notice = new Notice(`Collecting attachments for ${note.path}`);

  const attachmentsMap = new Map<string, string>();
  const isCanvas = isCanvasFile(app, note);

  await applyFileChanges(app, note, async () => {
    const cache = await getCacheSafe(app, note);

    if (!cache) {
      return [];
    }

    const links = isCanvas ? await getCanvasLinks(app, note) : getAllLinks(cache);
    const changes: FileChange[] = [];

    for (const link of links) {
      const attachmentMoveResult = await prepareAttachmentToMove(plugin, link, note.path, note.path);
      if (!attachmentMoveResult) {
        continue;
      }

      if (plugin.settings.isExcludedFromAttachmentCollecting(attachmentMoveResult.oldAttachmentPath)) {
        continue;
      }

      const backlinks = await getBacklinksForFileSafe(app, attachmentMoveResult.oldAttachmentPath);
      if (backlinks.keys().length > 1) {
        if (plugin.settings.shouldDuplicateCollectedAttachments) {
          attachmentMoveResult.newAttachmentPath = await copySafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
        } else {
          continue;
        }
      } else {
        attachmentMoveResult.newAttachmentPath = await renameSafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
        await deleteEmptyFolderHierarchy(app, dirname(attachmentMoveResult.oldAttachmentPath));
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
  });

  if (isCanvas) {
    await process(app, note, (content) => {
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
    addToQueue(plugin.app, () => collectAttachmentsInFolder(plugin, note?.parent ?? throwExpression(new Error('Parent folder not found'))));
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
      new Notice('Note path is ignored');
      return true;
    }

    addToQueue(plugin.app, () => collectAttachments(plugin, note));
  }

  return true;
}

export function collectAttachmentsEntireVault(plugin: Plugin): void {
  addToQueue(plugin.app, () => collectAttachmentsInFolder(plugin, plugin.app.vault.getRoot()));
}

export async function collectAttachmentsInFolder(plugin: Plugin, folder: TFolder): Promise<void> {
  if (
    !await confirm({
      app: plugin.app,
      message: createFragment((f) => {
        f.appendText('Do you want to collect attachments for all notes in folder: ');
        appendCodeBlock(f, folder.path);
        f.appendText(' and all its subfolders?');
        f.createEl('br');
        f.appendText('This operation cannot be undone.');
      }),
      title: createFragment((f) => {
        setIcon(f.createSpan(), 'lucide-alert-triangle');
        f.appendText(' Collect attachments in folder');
      })
    })
  ) {
    return;
  }
  plugin.consoleDebug(`Collect attachments in folder: ${folder.path}`);
  const files: TFile[] = [];
  Vault.recurseChildren(folder, (child) => {
    if (isNoteEx(plugin, child)) {
      files.push(child as TFile);
    }
  });

  files.sort((a, b) => a.path.localeCompare(b.path));

  await loop({
    abortSignal: plugin.abortSignal,
    buildNoticeMessage: (file, iterationStr) => `Collecting attachments ${iterationStr} - ${file.path}`,
    items: files,
    processItem: async (file) => {
      if (plugin.settings.isPathIgnored(file.path)) {
        return;
      }
      await collectAttachments(plugin, file);
    },
    progressBarTitle: 'Custom Attachment Location: Collecting attachments...',
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

async function prepareAttachmentToMove(
  plugin: Plugin,
  link: Reference,
  newNotePath: string,
  oldNotePath: string
): Promise<AttachmentMoveResult | null> {
  const app = plugin.app;

  const oldAttachmentFile = extractLinkFile(app, link, oldNotePath);
  if (!oldAttachmentFile) {
    return null;
  }

  if (isNoteEx(plugin, oldAttachmentFile)) {
    return null;
  }

  const oldAttachmentPath = oldAttachmentFile.path;
  const oldAttachmentName = oldAttachmentFile.name;

  const oldNoteBaseName = basename(oldNotePath, extname(oldNotePath));
  const newNoteBaseName = basename(newNotePath, extname(newNotePath));

  let newAttachmentName: string;

  if (plugin.settings.shouldRenameCollectedAttachments) {
    newAttachmentName = makeFileName(
      await getPastedFileName(plugin, new Substitutions(plugin.app, newNotePath, oldAttachmentFile.name)),
      oldAttachmentFile.extension
    );
  } else if (plugin.settings.shouldRenameAttachmentFiles) {
    newAttachmentName = oldAttachmentName.replaceAll(oldNoteBaseName, newNoteBaseName);
  } else {
    newAttachmentName = oldAttachmentName;
  }

  const newAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, newNotePath, newAttachmentName);
  const newAttachmentPath = join(newAttachmentFolderPath, newAttachmentName);

  if (oldAttachmentPath === newAttachmentPath) {
    return null;
  }

  return {
    newAttachmentPath,
    oldAttachmentPath
  };
}
