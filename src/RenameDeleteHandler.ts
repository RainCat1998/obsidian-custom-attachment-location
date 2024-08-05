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
import { getAttachmentFolderFullPath } from "./AttachmentPath.ts";
import { createSubstitutionsFromPath } from "./Substitutions.ts";
import {
  isNote,
  removeFolderSafe,
  applyFileChanges,
  processWithRetry,
  createFolderSafe
} from "./Vault.ts";
import {
  getAllLinks,
  getCacheSafe
} from "./MetadataCache.ts";
import { showError } from "./Error.ts";
import { generateMarkdownLink } from "./GenerateMarkdownLink.ts";
import type { CanvasData } from "obsidian/canvas.js";
import { toJson } from "./Object.ts";
import { splitSubpath } from "./AttachmentCollector.ts";

let isRenaming = false;

export async function handleRename(plugin: CustomAttachmentLocationPlugin, file: TAbstractFile, oldPath: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const updateAllLinks = plugin.app.fileManager.updateAllLinks;
  try {
    plugin.app.fileManager.updateAllLinks = async (): Promise<void> => { };

    if (isRenaming) {
      return;
    }

    isRenaming = true;
    console.debug("Handle Rename");

    if (!(file instanceof TFile)) {
      return;
    }

    const app = plugin.app;

    const renameMap = new Map<string, string>();
    await fillRenameMap(plugin, file, oldPath, renameMap);

    for (const [oldPath, newPath] of renameMap.entries()) {
      await processRename(app, oldPath, newPath, renameMap);
    }
  } finally {
    isRenaming = false;
    plugin.app.fileManager.updateAllLinks = updateAllLinks;
  }
}

export async function handleDelete(plugin: CustomAttachmentLocationPlugin, file: TAbstractFile): Promise<void> {
  console.debug("Handle Delete");
  if (!isNote(file)) {
    return;
  }

  const fullPath = await getAttachmentFolderFullPath(plugin, createSubstitutionsFromPath(file.path));
  await removeFolderSafe(plugin.app, fullPath, file.path);
}

async function updateLinksInFile(app: App, file: TFile, oldPath: string, renameMap: Map<string, string>): Promise<void> {
  await applyFileChanges(app, file, async () => {
    const cache = await getCacheSafe(app, file);
    if (!cache) {
      return [];
    }

    return await Promise.all(getAllLinks(cache).map(async (link) => ({
      startIndex: link.position.start.offset,
      endIndex: link.position.end.offset,
      oldContent: link.original,
      newContent: await convertLink(app, link, file, oldPath, renameMap)
    })));
  });
}

async function updateLink(app: App, link: ReferenceCache, file: TFile | null, source: TFile, renameMap?: Map<string, string>): Promise<string> {
  if (!file) {
    return link.original;
  }
  const isEmbed = link.original.startsWith("!");
  const isWikilink = link.original.includes("[[");
  const { linkPath, subpath } = splitSubpath(link.link);

  let fakeFileCreated = false;

  const newPath = renameMap?.get(file.path);
  if (newPath) {
    file = app.vault.getFileByPath(newPath);
    if (!file) {
      await createFolderSafe(app, dirname(newPath));
      file = await app.vault.create(newPath, "");
      fakeFileCreated = true;
    }
  }

  const newLink = generateMarkdownLink(app, file, source.path, subpath, link.displayText === basename(linkPath, extname(linkPath)) ? undefined : link.displayText, isEmbed, isWikilink);

  if (fakeFileCreated) {
    await app.vault.delete(file);
  }

  return newLink;
}

function convertLink(app: App, link: ReferenceCache, source: TFile, oldPath: string, renameMap: Map<string, string>): Promise<string> {
  oldPath ??= source.path;
  return updateLink(app, link, extractLinkFile(app, link, oldPath), source, renameMap);
}

function extractLinkFile(app: App, link: ReferenceCache, oldPath: string): TFile | null {
  const { linkPath } = splitSubpath(link.link);
  return app.metadataCache.getFirstLinkpathDest(linkPath, oldPath);
}

async function fillRenameMap(plugin: CustomAttachmentLocationPlugin, file: TFile, oldPath: string, renameMap: Map<string, string>): Promise<void> {
  renameMap.set(oldPath, file.path);

  if (!isNote(file)) {
    return;
  }

  const oldAttachmentFolderPath = await getAttachmentFolderFullPath(plugin, createSubstitutionsFromPath(oldPath));
  const newAttachmentFolderPath = await getAttachmentFolderFullPath(plugin, createSubstitutionsFromPath(file.path));

  const oldAttachmentFolder = plugin.app.vault.getFolderByPath(oldAttachmentFolderPath);

  if (!oldAttachmentFolder) {
    return;
  }

  const children: TFile[] = [];

  if (oldAttachmentFolderPath !== newAttachmentFolderPath || plugin.settings.autoRenameFiles) {
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
    const newChildPath = join(newAttachmentFolderPath, dirname(relativePath), newChildName + "." + child.extension);
    if (child.path !== newChildPath) {
      renameMap.set(child.path, newChildPath);
    }
  }
}

async function processRename(app: App, oldPath: string, newPath: string, renameMap: Map<string, string>): Promise<void> {
  const oldFile = app.vault.getFileByPath(oldPath);
  const newFile = app.vault.getFileByPath(newPath);
  const file = oldFile ?? newFile;
  if (!file) {
    return;
  }
  const backlinks = app.metadataCache.getBacklinksForFile(file);

  for (const parentNotePath of backlinks.keys()) {
    let parentNote = app.vault.getFileByPath(parentNotePath);
    if (!parentNote) {
      const newParentNotePath = renameMap.get(parentNotePath);
      if (newParentNotePath) {
        parentNote = app.vault.getFileByPath(newParentNotePath);
      }
    }

    if (!parentNote) {
      showError(`Parent note not found: ${parentNotePath}`);
      continue;
    }

    await applyFileChanges(app, parentNote, async () => await Promise.all((app.metadataCache.getBacklinksForFile(file).get(parentNotePath) ?? []).map(async (link) => ({
      startIndex: link.position.start.offset,
      endIndex: link.position.end.offset,
      oldContent: link.original,
      newContent: await updateLink(app, link, file, parentNote)
    }))));
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

  if (oldFile) {
    await createFolderSafe(app, dirname(newPath));
    let oldDir = oldFile.parent;
    await app.vault.rename(oldFile, newPath);
    while (oldDir != null) {
      if (oldDir.children.length > 0) {
        break;
      }

      if (!await removeFolderSafe(app, oldDir.path)) {
        break;
      }
      oldDir = oldDir.parent;
    }
  }
}
