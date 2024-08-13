import {
  App,
  Notice,
  Vault,
  type ReferenceCache,
  type TFile,
  type TFolder
} from "obsidian";
import type { CanvasData } from "obsidian/canvas.d.ts";
import {
  getAllLinks,
  getBacklinksForFileSafe,
  getCacheSafe
} from "./MetadataCache.ts";
import {
  applyFileChanges,
  createFolderSafe,
  isNote,
  processWithRetry,
  removeEmptyFolderHierarchy
} from "./Vault.ts";
import { invokeAsyncSafely } from "./Async.ts";
import { posix } from "@jinder/path";
import { toJson } from "./Object.ts";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import { getAttachmentFolderFullPathForPath } from "./AttachmentPath.ts";
const {
  basename,
  dirname,
  extname,
  join
} = posix;

type AttachmentMoveResult = {
  oldAttachmentPath: string;
  newAttachmentPath: string;
  newAttachmentLink: string;
}

type SplitSubpathResult = {
  linkPath: string;
  subpath: string | undefined;
}

export function collectAttachmentsCurrentNote(plugin: CustomAttachmentLocationPlugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!isNote(note)) {
    return false;
  }

  if (!checking) {
    invokeAsyncSafely(collectAttachments(plugin, note));
  }

  return true;
}

export function collectAttachmentsCurrentFolder(plugin: CustomAttachmentLocationPlugin, checking: boolean): boolean {
  const note = plugin.app.workspace.getActiveFile();
  if (!isNote(note)) {
    return false;
  }

  if (!checking) {
    invokeAsyncSafely(collectAttachmentsInFolder(plugin, note.parent!));
  }

  return true;
}

export function collectAttachmentsEntireVault(plugin: CustomAttachmentLocationPlugin): void {
  invokeAsyncSafely(collectAttachmentsInFolder(plugin, plugin.app.vault.getRoot()));
}

export async function collectAttachments(plugin: CustomAttachmentLocationPlugin, note: TFile, oldPath?: string, attachmentFilter?: (path: string) => boolean): Promise<void> {
  const app = plugin.app;
  oldPath ??= note.path;
  attachmentFilter ??= (): boolean => true;

  console.debug(`Collect attachments in note: ${note.path}`);

  const attachmentsMap = new Map<string, string>();
  const isCanvas = note.extension.toLowerCase() === "canvas";

  await applyFileChanges(app, note, async () => {
    const cache = await getCacheSafe(app, note);

    if (!cache) {
      return [];
    }

    const links = isCanvas ? await getCanvasLinks(app, note) : getAllLinks(cache);

    return (await Promise.all(links
      .map(async (link) => {
        const attachmentMoveResult = await prepareAttachmentToMove(plugin, link, note.path, oldPath);
        if (!attachmentMoveResult) {
          return null;
        }

        if (!attachmentFilter(attachmentMoveResult.oldAttachmentPath)) {
          return null;
        }

        attachmentsMap.set(attachmentMoveResult.oldAttachmentPath, attachmentMoveResult.newAttachmentPath);
        return isCanvas ? null : {
          startIndex: link.position.start.offset,
          endIndex: link.position.end.offset,
          oldContent: link.original,
          newContent: attachmentMoveResult.newAttachmentLink
        };
      })))
      .filter((change) => change !== null);
  });

  if (isCanvas) {
    await processWithRetry(app, note, (content) => {
      const canvasData = JSON.parse(content) as CanvasData;
      for (const node of canvasData.nodes) {
        if (node.type !== "file") {
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

  const notice = new Notice(`Collecting ${attachmentsMap.size} attachments for ${note.path}`);

  await getCacheSafe(app, note);

  for (const [oldPath, newPath] of attachmentsMap.entries()) {
    const oldAttachmentFile = app.vault.getFileByPath(oldPath);
    if (!oldAttachmentFile) {
      continue;
    }

    const oldAttachmentFolder = oldAttachmentFile.parent;

    const backlinks = await getBacklinksForFileSafe(app, oldAttachmentFile);
    await createFolderSafe(app, dirname(newPath), plugin.settings.keepEmptyAttachmentFolders);
    if (backlinks.count() === 0) {
      await app.vault.rename(oldAttachmentFile, newPath);
      await removeEmptyFolderHierarchy(app, oldAttachmentFolder);
    } else {
      await app.vault.copy(oldAttachmentFile, newPath);
    }
  }

  notice.hide();
}

async function prepareAttachmentToMove(plugin: CustomAttachmentLocationPlugin, link: ReferenceCache, newNotePath: string, oldNotePath: string): Promise<AttachmentMoveResult | null> {
  const app = plugin.app;
  const { linkPath, subpath } = splitSubpath(link.link);
  let oldAttachmentFile = app.metadataCache.getFirstLinkpathDest(linkPath, oldNotePath);
  if (!oldAttachmentFile) {
    return null;
  }

  if (isNote(oldAttachmentFile)) {
    return null;
  }

  oldAttachmentFile = oldAttachmentFile as TFile;

  const oldAttachmentPath = oldAttachmentFile.path;
  const oldAttachmentName = oldAttachmentFile.name;

  const oldNoteBaseName = basename(oldNotePath, extname(oldNotePath));
  const newNoteBaseName = basename(newNotePath, extname(newNotePath));

  const newAttachmentName = plugin.settings.autoRenameFiles ? oldAttachmentName.replaceAll(oldNoteBaseName, newNoteBaseName) : oldAttachmentName;
  const newAttachmentFolderPath = await getAttachmentFolderFullPathForPath(plugin, newNotePath);
  const newAttachmentPath = join(newAttachmentFolderPath, newAttachmentName);

  if (oldAttachmentPath === newAttachmentPath) {
    return null;
  }

  const shouldRemoveNewAttachmentFolder = await createFolderSafe(app, dirname(newAttachmentPath));
  const newAttachmentFolder = app.vault.getFolderByPath(dirname(newAttachmentPath))!;
  const newAttachmentFile = await app.vault.create(newAttachmentPath, "");

  let newAttachmentLink = app.fileManager.generateMarkdownLink(newAttachmentFile, newNotePath, subpath, link.displayText);

  await app.vault.delete(newAttachmentFile);
  if (shouldRemoveNewAttachmentFolder && !newAttachmentFolder.deleted) {
    await app.vault.delete(newAttachmentFolder);
  }

  if (!link.original.startsWith("!")) {
    newAttachmentLink = newAttachmentLink.slice(1);
    newAttachmentLink = newAttachmentLink.replace("[]", `[${link.displayText}]`);
  }

  return {
    oldAttachmentPath,
    newAttachmentPath,
    newAttachmentLink
  };
}

export async function collectAttachmentsInFolder(plugin: CustomAttachmentLocationPlugin, folder: TFolder): Promise<void> {
  console.debug(`Collect attachments in folder: ${folder.path}`);
  const files: TFile[] = [];
  Vault.recurseChildren(folder, (child) => {
    if (isNote(child)) {
      files.push(child);
    }
  });

  files.sort((a, b) => a.path.localeCompare(b.path));

  const notice = new Notice("", 0);
  let i = 0;

  for (const file of files) {
    i++;
    const message = `Collecting attachments # ${i} / ${files.length} - ${file.path}`;
    notice.setMessage(message);
    await collectAttachments(plugin, file);
  }

  notice.hide();
}

export function splitSubpath(link: string): SplitSubpathResult {
  const SUBPATH_SEPARATOR = "#";
  const [linkPath = "", subpath] = link.split(SUBPATH_SEPARATOR);
  return {
    linkPath,
    subpath: subpath ? SUBPATH_SEPARATOR + subpath : undefined
  };
}

async function getCanvasLinks(app: App, file: TFile): Promise<ReferenceCache[]> {
  const canvasData = await app.vault.readJson(file.path) as CanvasData;
  const files = canvasData.nodes.filter(node => node.type === "file").map(node => node.file);
  return files.map(file => ({
    link: file,
    original: file,
    position: {
      start: { col: 0, line: 0, loc: 0, offset: 0 },
      end: { col: 0, line: 0, loc: 0, offset: 0 }
    }
  }));
}
