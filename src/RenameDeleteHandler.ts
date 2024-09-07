import type {
  ReferenceCache,
  TAbstractFile
} from 'obsidian';
import {
  App,
  TFile,
  Vault
} from 'obsidian';
import type { CanvasData } from 'obsidian/canvas.js';
import { toJson } from 'obsidian-dev-utils/Object';
import {
  extractLinkFile,
  updateLink,
  updateLinksInFile
} from 'obsidian-dev-utils/obsidian/Link';
import {
  getAllLinks,
  getBacklinksForFileSafe,
  getCacheSafe
} from 'obsidian-dev-utils/obsidian/MetadataCache';
import {
  isCanvasFile,
  isMarkdownFile,
  isNote
} from 'obsidian-dev-utils/obsidian/TAbstractFile';
import {
  applyFileChanges,
  createFolderSafe,
  processWithRetry,
  removeEmptyFolderHierarchy,
  removeFolderSafe
} from 'obsidian-dev-utils/obsidian/Vault';
import {
  basename,
  dirname,
  extname,
  join,
  relative
} from 'obsidian-dev-utils/Path';
import { createTFileInstance } from 'obsidian-typings/implementations';

import { getAttachmentFolderFullPathForPath } from './AttachmentPath.ts';
import type CustomAttachmentLocationPlugin from './CustomAttachmentLocationPlugin.ts';

const renamingPaths = new Set<string>();
const specialRenames: SpecialRename[] = [];

interface SpecialRename {
  oldPath: string;
  newPath: string;
  tempPath: string;
}

export async function handleRename(plugin: CustomAttachmentLocationPlugin, file: TAbstractFile, oldPath: string): Promise<void> {
  console.debug(`Handle Rename ${oldPath} -> ${file.path}`);
  const app = plugin.app;

  if (renamingPaths.has(oldPath)) {
    return;
  }

  if (!(file instanceof TFile)) {
    return;
  }

  const specialRename = specialRenames.find((x) => x.oldPath === file.path);
  if (specialRename) {
    await app.vault.rename(file, specialRename.tempPath);
    return;
  }

  if (app.vault.adapter.insensitive && oldPath.toLowerCase() === file.path.toLowerCase() && dirname(oldPath) === dirname(file.path)) {
    specialRenames.push({
      oldPath,
      newPath: file.path,
      tempPath: join(file.parent?.path ?? '', '__temp__' + file.name)
    });

    await app.vault.rename(file, oldPath);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const updateAllLinks = app.fileManager.updateAllLinks;
  try {
    app.fileManager.updateAllLinks = async (): Promise<void> => {
      // do nothing
    };

    const renameMap = new Map<string, string>();
    await fillRenameMap(plugin, file, oldPath, renameMap);
    for (const oldPath of renameMap.keys()) {
      renamingPaths.add(oldPath);
    }

    for (const [oldPath2, newPath2] of renameMap.entries()) {
      await processRename(plugin, oldPath2, newPath2, renameMap);
    }

    await processRename(plugin, oldPath, file.path, renameMap);
  } finally {
    renamingPaths.delete(oldPath);
    app.fileManager.updateAllLinks = updateAllLinks;

    const specialRename = specialRenames.find((x) => x.tempPath === file.path);
    if (specialRename) {
      await app.vault.rename(file, specialRename.newPath);
      specialRenames.remove(specialRename);
    }
  }
}

export async function handleDelete(plugin: CustomAttachmentLocationPlugin, file: TAbstractFile): Promise<void> {
  console.debug(`Handle Delete ${file.path}`);
  const app = plugin.app;
  if (!isNote(file)) {
    return;
  }

  if (renamingPaths.has(file.path)) {
    return;
  }

  const attachmentsFolderPath = await getAttachmentFolderFullPathForPath(plugin, file.path);
  await removeFolderSafe(app, attachmentsFolderPath, file.path);
}

async function fillRenameMap(plugin: CustomAttachmentLocationPlugin, file: TFile, oldPath: string, renameMap: Map<string, string>): Promise<void> {
  const app = plugin.app;

  if (!isNote(file)) {
    renameMap.set(oldPath, file.path);
    return;
  }

  const oldAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, oldPath);
  const newAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, file.path);
  const dummyOldAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, join(dirname(oldPath), 'DUMMY_FILE.md'));

  const oldAttachmentFolder = app.vault.getFolderByPath(oldAttachmentFolderPath);

  if (!oldAttachmentFolder) {
    return;
  }

  if (oldAttachmentFolderPath === newAttachmentFolderPath) {
    return;
  }

  const children: TFile[] = [];

  if (oldAttachmentFolderPath === dummyOldAttachmentFolderPath) {
    const cache = await getCacheSafe(app, file);
    if (!cache) {
      return;
    }
    for (const link of getAllLinks(cache)) {
      const attachmentFile = extractLinkFile(app, link, oldPath);
      if (!attachmentFile) {
        continue;
      }

      if (attachmentFile.path.startsWith(oldAttachmentFolderPath)) {
        const backlinks = await getBacklinksForFileSafe(app, attachmentFile);
        if (backlinks.keys().length === 1) {
          children.push(attachmentFile);
        }
      }
    }
  } else {
    Vault.recurseChildren(oldAttachmentFolder, (child) => {
      if (child instanceof TFile) {
        children.push(child);
      }
    });
  }

  const newNoteName = file.basename;
  const oldNoteName = basename(oldPath, extname(oldPath));

  for (const child of children) {
    if (isNote(child)) {
      continue;
    }
    const relativePath = relative(oldAttachmentFolderPath, child.path);
    const newChildName = plugin.settingsCopy.autoRenameFiles ? child.basename.replaceAll(oldNoteName, newNoteName) : child.basename;
    const newDir = join(newAttachmentFolderPath, dirname(relativePath));
    let newChildPath = join(newDir, newChildName + '.' + child.extension);
    if (child.path !== newChildPath) {
      newChildPath = app.vault.getAvailablePath(join(newDir, newChildName), child.extension);
      renameMap.set(child.path, newChildPath);
    }
  }
}

async function processRename(plugin: CustomAttachmentLocationPlugin, oldPath: string, newPath: string, renameMap: Map<string, string>): Promise<void> {
  const app = plugin.app;
  let oldFile: TFile | null = null;

  try {
    oldFile = app.vault.getFileByPath(oldPath);
    let newFile = app.vault.getFileByPath(newPath);

    if (oldFile) {
      await createFolderSafe(app, dirname(newPath));
      const oldFolder = oldFile.parent;
      try {
        if (newFile) {
          try {
            await app.vault.delete(newFile);
          } catch (e) {
            if (app.vault.getAbstractFileByPath(newPath)) {
              throw e;
            }
          }
        }
        await app.vault.rename(oldFile, newPath);
      } catch (e) {
        if (!app.vault.getAbstractFileByPath(newPath) || app.vault.getAbstractFileByPath(oldPath)) {
          throw e;
        }
      }
      await removeEmptyFolderHierarchy(app, oldFolder);
    }

    oldFile = createTFileInstance(app.vault, oldPath);
    newFile = app.vault.getFileByPath(newPath);

    if (!oldFile.deleted || !newFile) {
      throw new Error(`Could not rename ${oldPath} to ${newPath}`);
    }

    const backlinks = await getBacklinks(app, oldFile, newFile);

    for (const parentNotePath of backlinks.keys()) {
      let parentNote = app.vault.getFileByPath(parentNotePath);
      if (!parentNote) {
        const newParentNotePath = renameMap.get(parentNotePath);
        if (newParentNotePath) {
          parentNote = app.vault.getFileByPath(newParentNotePath);
        }
      }

      if (!parentNote) {
        console.warn(`Parent note not found: ${parentNotePath}`);
        continue;
      }

      await applyFileChanges(app, parentNote, async () => {
        if (!oldFile) {
          return [];
        }

        const links
          = (await getBacklinks(app, oldFile, newFile)).get(parentNotePath) ?? [];
        const changes = [];

        for (const link of links) {
          changes.push({
            startIndex: link.position.start.offset,
            endIndex: link.position.end.offset,
            oldContent: link.original,
            newContent: updateLink({
              app,
              link,
              pathOrFile: newFile,
              oldPathOrFile: oldPath,
              sourcePathOrFile: parentNote,
              renameMap
            })
          });
        }

        return changes;
      });
    }

    if (isCanvasFile(newFile)) {
      await processWithRetry(app, newFile, (content) => {
        const canvasData = JSON.parse(content) as CanvasData;
        for (const node of canvasData.nodes) {
          if (node.type !== 'file') {
            continue;
          }
          const newPath = renameMap.get(node.file);
          if (!newPath) {
            continue;
          }
          node.file = newPath;
        }
        return toJson(canvasData);
      });
    } else if (isMarkdownFile(newFile)) {
      await updateLinksInFile({
        app,
        pathOrFile: newFile,
        oldPathOrFile: oldPath,
        renameMap
      });
    }
  } finally {
    renamingPaths.delete(oldPath);
  }
}

async function getBacklinks(app: App, oldFile: TFile, newFile: TFile | null): Promise<Map<string, ReferenceCache[]>> {
  const backlinks = new Map<string, ReferenceCache[]>();
  const oldLinks = await getBacklinksForFileSafe(app, oldFile);
  for (const path of oldLinks.keys()) {
    backlinks.set(path, oldLinks.get(path) ?? []);
  }

  if (!newFile) {
    return backlinks;
  }

  const newLinks = await getBacklinksForFileSafe(app, newFile);

  for (const path of newLinks.keys()) {
    const links = backlinks.get(path) ?? [];
    links.push(...newLinks.get(path) ?? []);
    backlinks.set(path, links);
  }

  return backlinks;
}
