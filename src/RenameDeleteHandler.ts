import {
  App,
  TFile,
  Vault,
  type ReferenceCache,
  type TAbstractFile
} from "obsidian";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import { posix } from "@jinder/path";
const {
  basename,
  extname,
  relative,
  join,
  dirname
} = posix;
import { getAttachmentFolderFullPathForPath } from "./AttachmentPath.ts";
import {
  isNote,
  removeFolderSafe,
  applyFileChanges,
  processWithRetry,
  createFolderSafe,
  removeEmptyFolderHierarchy
} from "./Vault.ts";
import {
  getAllLinks,
  getBacklinksForFileSafe,
  getCacheSafe
} from "./MetadataCache.ts";
import type { CanvasData } from "obsidian/canvas.js";
import { toJson } from "./Object.ts";
import { extractLinkFile, updateLink, updateLinksInFile } from "./Link.ts";

const renameMap = new Map<string, string>();

export async function handleRename(plugin: CustomAttachmentLocationPlugin, file: TAbstractFile, oldPath: string): Promise<void> {
  if (renameMap.has(oldPath)) {
    return;
  }

  console.debug("Handle Rename");

  if (!(file instanceof TFile)) {
    return;
  }

  const app = plugin.app;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const updateAllLinks = app.fileManager.updateAllLinks;
  try {
    plugin.app.fileManager.updateAllLinks = async (): Promise<void> => { };

    await fillRenameMap(plugin, file, oldPath);

    for (const [oldPath2, newPath2] of renameMap.entries()) {
      await processRename(plugin, oldPath2, newPath2);
    }
  } finally {
    renameMap.delete(oldPath);
    plugin.app.fileManager.updateAllLinks = updateAllLinks;
  }
}

export async function handleDelete(plugin: CustomAttachmentLocationPlugin, file: TAbstractFile): Promise<void> {
  console.debug("Handle Delete");
  if (!isNote(file)) {
    return;
  }

  if (renameMap.has(file.path)) {
    return;
  }

  const attachmentsFolderPath = await getAttachmentFolderFullPathForPath(plugin, file.path);
  await removeFolderSafe(plugin.app, attachmentsFolderPath, file.path);
}

async function fillRenameMap(plugin: CustomAttachmentLocationPlugin, file: TFile, oldPath: string): Promise<void> {
  const app = plugin.app;
  renameMap.set(oldPath, file.path);

  if (!isNote(file)) {
    return;
  }

  const oldAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, oldPath);
  const newAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, file.path);
  const dummyOldAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, join(dirname(oldPath), "DUMMY_FILE.md"));

  const oldAttachmentFolder = plugin.app.vault.getFolderByPath(oldAttachmentFolderPath);

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

  for (let child of children) {
    if (isNote(child)) {
      continue;
    }
    child = child as TFile;
    const relativePath = relative(oldAttachmentFolderPath, child.path);
    const newChildName = plugin.settings.autoRenameFiles ? child.basename.replaceAll(oldNoteName, newNoteName) : child.basename;
    const newDir = join(newAttachmentFolderPath, dirname(relativePath));
    let newChildPath = join(newDir, newChildName + "." + child.extension);
    if (child.path !== newChildPath) {
      newChildPath = plugin.app.vault.getAvailablePath(join(newDir, newChildName), child.extension);
      renameMap.set(child.path, newChildPath);
    }
  }
}

async function processRename(plugin: CustomAttachmentLocationPlugin, oldPath: string, newPath: string): Promise<void> {
  const app = plugin.app;
  let oldFile: TFile | null = null;
  let fakeOldFileCreated = false;

  try {
    oldFile = app.vault.getFileByPath(oldPath);
    const newFile = app.vault.getFileByPath(newPath);
    const file = oldFile ?? newFile;
    if (!file) {
      return;
    }

    if (!oldFile) {
      fakeOldFileCreated = true;
      oldFile = await app.vault.create(oldPath, "");
    }

    const backlinks = await getBacklinks(plugin.app, oldFile, newFile);

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
        const links =
          (await getBacklinks(plugin.app, oldFile!, newFile)).get(parentNotePath) ?? [];
        const changes = [];

        for (const link of links) {
          changes.push({
            startIndex: link.position.start.offset,
            endIndex: link.position.end.offset,
            oldContent: link.original,
            newContent: updateLink({
              app,
              link,
              file,
              oldPath,
              source: parentNote,
              renameMap
            }),
          });
        }

        return changes;
      });
    }

    if (file.extension.toLowerCase() === "canvas") {
      await processWithRetry(app, file, (content) => {
        const canvasData = JSON.parse(content) as CanvasData;
        for (const node of canvasData.nodes) {
          if (node.type !== "file") {
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
    } else if (file.extension.toLowerCase() === "md") {
      await updateLinksInFile(app, file, oldPath, renameMap);
    }

    if (!fakeOldFileCreated) {
      await createFolderSafe(app, dirname(newPath));
      const oldFolder = oldFile.parent;
      if (newFile) {
        await app.vault.delete(newFile);
      }
      await app.vault.rename(oldFile, newPath);
      await removeEmptyFolderHierarchy(app, oldFolder);
    }
  } finally {
    if (fakeOldFileCreated && oldFile) {
      await app.vault.delete(oldFile);
    }
    renameMap.delete(oldPath);
  }
}

async function getBacklinks(app: App, oldFile: TFile, newFile: TFile | null): Promise<Map<string, ReferenceCache[]>> {
  const backlinks = new Map<string, ReferenceCache[]>();
  const oldLinks = await getBacklinksForFileSafe(app, oldFile);
  for (const path of oldLinks.keys()) {
    backlinks.set(path, oldLinks.get(path)!);
  }

  if (!newFile) {
    return backlinks;
  }

  const newLinks = await getBacklinksForFileSafe(app, newFile);

  for (const path of newLinks.keys()) {
    const links = backlinks.get(path) ?? [];
    links.push(...newLinks.get(path)!);
    backlinks.set(path, links);
  }

  return backlinks;
}
