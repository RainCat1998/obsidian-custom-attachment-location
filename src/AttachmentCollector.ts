import type {
  Reference,
  ReferenceCache,
  TFile,
  TFolder
} from 'obsidian';
import type { FileChange } from 'obsidian-dev-utils/obsidian/FileChange';
import type { CanvasData } from 'obsidian/canvas.d.ts';

import {
  App,
  Notice,
  setIcon,
  Vault
} from 'obsidian';
import { appendCodeBlock } from 'obsidian-dev-utils/DocumentFragment';
import { throwExpression } from 'obsidian-dev-utils/Error';
import { toJson } from 'obsidian-dev-utils/Object';
import { applyFileChanges } from 'obsidian-dev-utils/obsidian/FileChange';
import {
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
import { confirm } from 'obsidian-dev-utils/obsidian/Modal/Confirm';
import { addToQueue } from 'obsidian-dev-utils/obsidian/Queue';
import { referenceToFileChange } from 'obsidian-dev-utils/obsidian/Reference';
import {
  copySafe,
  deleteEmptyFolderHierarchy,
  process,
  renameSafe
} from 'obsidian-dev-utils/obsidian/Vault';
import {
  basename,
  dirname,
  extname,
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';

import type { CustomAttachmentLocationPlugin } from './CustomAttachmentLocationPlugin.ts';

import {
  getAttachmentFolderFullPathForPath,
  getPastedFileName
} from './AttachmentPath.ts';
import { createSubstitutionsFromPath } from './Substitutions.ts';

interface AttachmentMoveResult {
  newAttachmentPath: string;
  oldAttachmentPath: string;
}

export async function collectAttachments(plugin: CustomAttachmentLocationPlugin, note: TFile, oldPath?: string, attachmentFilter?: (path: string) => boolean): Promise<void> {
  const app = plugin.app;
  oldPath ??= note.path;
  attachmentFilter ??= (): boolean => true;

  const notice = new Notice(`Collecting attachments for ${note.path}`);

  const attachmentsMap = new Map<string, string>();
  const isCanvas = isCanvasFile(note);

  await applyFileChanges(app, note, async () => {
    const cache = await getCacheSafe(app, note);

    if (!cache) {
      return [];
    }

    const links = isCanvas ? await getCanvasLinks(app, note) : getAllLinks(cache);
    const changes: FileChange[] = [];

    for (const link of links) {
      const attachmentMoveResult = await prepareAttachmentToMove(plugin, link, note.path, oldPath);
      if (!attachmentMoveResult) {
        continue;
      }

      if (!attachmentFilter(attachmentMoveResult.oldAttachmentPath)) {
        continue;
      }

      const backlinks = await getBacklinksForFileSafe(app, attachmentMoveResult.oldAttachmentPath);
      if (backlinks.count() > 1) {
        attachmentMoveResult.newAttachmentPath = await copySafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
      } else {
        attachmentMoveResult.newAttachmentPath = await renameSafe(app, attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
        await deleteEmptyFolderHierarchy(app, dirname(attachmentMoveResult.oldAttachmentPath));
      }

      attachmentsMap.set(attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);

      if (!isCanvas) {
        const newContent = updateLink({
          app: app,
          link,
          oldPathOrFile: attachmentMoveResult.oldAttachmentPath,
          pathOrFile: attachmentMoveResult.newAttachmentPath,
          sourcePathOrFile: note
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

export function collectAttachmentsCurrentFolder(plugin: CustomAttachmentLocationPlugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!isNote(note)) {
    return false;
  }

  if (!checking) {
    addToQueue(plugin.app, () => collectAttachmentsInFolder(plugin, note?.parent ?? throwExpression(new Error('Parent folder not found'))));
  }

  return true;
}

export function collectAttachmentsCurrentNote(plugin: CustomAttachmentLocationPlugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!note || !isNote(note)) {
    return false;
  }

  if (!checking) {
    addToQueue(plugin.app, () => collectAttachments(plugin, note));
  }

  return true;
}

export function collectAttachmentsEntireVault(plugin: CustomAttachmentLocationPlugin): void {
  addToQueue(plugin.app, () => collectAttachmentsInFolder(plugin, plugin.app.vault.getRoot()));
}

export async function collectAttachmentsInFolder(plugin: CustomAttachmentLocationPlugin, folder: TFolder): Promise<void> {
  if (!await confirm({
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
  })) {
    return;
  }
  console.debug(`Collect attachments in folder: ${folder.path}`);
  const files: TFile[] = [];
  Vault.recurseChildren(folder, (child) => {
    if (isNote(child)) {
      files.push(child as TFile);
    }
  });

  files.sort((a, b) => a.path.localeCompare(b.path));

  await loop({
    abortSignal: plugin.abortSignal,
    buildNoticeMessage: (file, iterationStr) => `Collecting attachments ${iterationStr} - ${file.path}`,
    continueOnError: true,
    items: files,
    processItem: async (file) => {
      await collectAttachments(plugin, file);
    }
  });
}

async function getCanvasLinks(app: App, file: TFile): Promise<ReferenceCache[]> {
  const canvasData = await app.vault.readJson(file.path) as CanvasData;
  const files = canvasData.nodes.filter((node) => node.type === 'file').map((node) => node.file);
  return files.map((file) => ({
    link: file,
    original: file,
    position: {
      end: { col: 0, line: 0, loc: 0, offset: 0 },
      start: { col: 0, line: 0, loc: 0, offset: 0 }
    }
  }));
}

async function prepareAttachmentToMove(plugin: CustomAttachmentLocationPlugin, link: Reference, newNotePath: string, oldNotePath: string): Promise<AttachmentMoveResult | null> {
  const app = plugin.app;

  const oldAttachmentFile = extractLinkFile(app, link, oldNotePath);
  if (!oldAttachmentFile) {
    return null;
  }

  if (isNote(oldAttachmentFile)) {
    return null;
  }

  const oldAttachmentPath = oldAttachmentFile.path;
  const oldAttachmentName = oldAttachmentFile.name;

  const oldNoteBaseName = basename(oldNotePath, extname(oldNotePath));
  const newNoteBaseName = basename(newNotePath, extname(newNotePath));

  let newAttachmentName: string;

  if (plugin.settingsCopy.renameCollectedFiles) {
    newAttachmentName = makeFileName(await getPastedFileName(plugin, createSubstitutionsFromPath(newNotePath, oldAttachmentFile.basename)), oldAttachmentFile.extension);
  } else if (plugin.settingsCopy.autoRenameFiles) {
    newAttachmentName = oldAttachmentName.replaceAll(oldNoteBaseName, newNoteBaseName);
  } else {
    newAttachmentName = oldAttachmentName;
  }

  const newAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, newNotePath);
  const newAttachmentPath = join(newAttachmentFolderPath, newAttachmentName);

  if (oldAttachmentPath === newAttachmentPath) {
    return null;
  }

  return {
    newAttachmentPath,
    oldAttachmentPath
  };
}
