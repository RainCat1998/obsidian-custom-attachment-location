import type {
  ReferenceCache,
  TFile,
  TFolder
} from 'obsidian';
import {
  App,
  Notice,
  setIcon,
  Vault
} from 'obsidian';
import type { CanvasData } from 'obsidian/canvas.d.ts';
import { appendCodeBlock } from 'obsidian-dev-utils/DocumentFragment';
import { throwExpression } from 'obsidian-dev-utils/Error';
import { toJson } from 'obsidian-dev-utils/Object';
import { chainAsyncFn } from 'obsidian-dev-utils/obsidian/ChainedPromise';
import {
  isCanvasFile,
  isNote
} from 'obsidian-dev-utils/obsidian/FileSystem';
import {
  splitSubpath,
  updateLink
} from 'obsidian-dev-utils/obsidian/Link';
import {
  getAllLinks,
  getBacklinksForFileSafe,
  getCacheSafe
} from 'obsidian-dev-utils/obsidian/MetadataCache';
import { confirm } from 'obsidian-dev-utils/obsidian/Modal/Confirm';
import type { FileChange } from 'obsidian-dev-utils/obsidian/Vault';
import {
  applyFileChanges,
  copySafe,
  deleteEmptyFolderHierarchy,
  processWithRetry,
  renameSafe
} from 'obsidian-dev-utils/obsidian/Vault';
import {
  basename,
  dirname,
  extname,
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';

import {
  getAttachmentFolderFullPathForPath,
  getPastedFileName
} from './AttachmentPath.ts';
import type CustomAttachmentLocationPlugin from './CustomAttachmentLocationPlugin.ts';
import { createSubstitutionsFromPath } from './Substitutions.ts';

interface AttachmentMoveResult {
  oldAttachmentPath: string;
  newAttachmentPath: string;
}

export function collectAttachmentsCurrentNote(plugin: CustomAttachmentLocationPlugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!note || !isNote(note)) {
    return false;
  }

  if (!checking) {
    chainAsyncFn(plugin.app, () => collectAttachments(plugin, note));
  }

  return true;
}

export function collectAttachmentsCurrentFolder(plugin: CustomAttachmentLocationPlugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!isNote(note)) {
    return false;
  }

  if (!checking) {
    chainAsyncFn(plugin.app, () => collectAttachmentsInFolder(plugin, note?.parent ?? throwExpression(new Error('Parent folder not found'))));
  }

  return true;
}

export function collectAttachmentsEntireVault(plugin: CustomAttachmentLocationPlugin): void {
  chainAsyncFn(plugin.app, () => collectAttachmentsInFolder(plugin, plugin.app.vault.getRoot()));
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
        changes.push({
          startIndex: link.position.start.offset,
          endIndex: link.position.end.offset,
          oldContent: link.original,
          newContent: updateLink({
            app: app,
            link,
            pathOrFile: attachmentMoveResult.newAttachmentPath,
            oldPathOrFile: attachmentMoveResult.oldAttachmentPath,
            sourcePathOrFile: note
          })
        });
      }
    }

    return changes;
  });

  if (isCanvas) {
    await processWithRetry(app, note, (content) => {
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

async function prepareAttachmentToMove(plugin: CustomAttachmentLocationPlugin, link: ReferenceCache, newNotePath: string, oldNotePath: string): Promise<AttachmentMoveResult | null> {
  const app = plugin.app;
  const { linkPath } = splitSubpath(link.link);
  const oldAttachmentFile = app.metadataCache.getFirstLinkpathDest(linkPath, oldNotePath);
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
    oldAttachmentPath,
    newAttachmentPath
  };
}

export async function collectAttachmentsInFolder(plugin: CustomAttachmentLocationPlugin, folder: TFolder): Promise<void> {
  if (!await confirm({
    app: plugin.app,
    title: createFragment((f) => {
      setIcon(f.createSpan(), 'lucide-alert-triangle');
      f.appendText(' Collect attachments in folder');
    }),
    message: createFragment((f) => {
      f.appendText('Do you want to collect attachments for all notes in folder: ');
      appendCodeBlock(f, folder.path);
      f.appendText(' and all its subfolders?');
      f.createEl('br');
      f.appendText('This operation cannot be undone.');
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

  const notice = new Notice('', 0);
  let i = 0;

  for (const file of files) {
    i++;
    const message = `Collecting attachments # ${i.toString()} / ${files.length.toString()} - ${file.path}`;
    notice.setMessage(message);
    await collectAttachments(plugin, file);
  }

  notice.hide();
}

async function getCanvasLinks(app: App, file: TFile): Promise<ReferenceCache[]> {
  const canvasData = await app.vault.readJson(file.path) as CanvasData;
  const files = canvasData.nodes.filter((node) => node.type === 'file').map((node) => node.file);
  return files.map((file) => ({
    link: file,
    original: file,
    position: {
      start: { col: 0, line: 0, loc: 0, offset: 0 },
      end: { col: 0, line: 0, loc: 0, offset: 0 }
    }
  }));
}
