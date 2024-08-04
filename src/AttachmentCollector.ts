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
  getCacheSafe
} from "./MetadataCache.ts";
import {
  applyFileChanges,
  createFolderSafe,
  isNote,
  processWithRetry
} from "./Vault.ts";
import { invokeAsyncSafely } from "./Async.ts";
import { createTFile } from "obsidian-typings/implementations";
import { posix } from "@jinder/path";
import { toJson } from "./Object.ts";
const { dirname } = posix;


type AttachmentMoveResult = {
  oldPath: string;
  newPath: string;
  newLink: string;
}

type SplitSubpathResult = {
  linkPath: string;
  subpath: string | undefined;
}

export function collectAttachmentsCurrentNote(app: App, checking: boolean): boolean {
  const note = app.workspace.getActiveFile();
  if (!isNote(note)) {
    return false;
  }

  if (!checking) {
    invokeAsyncSafely(collectAttachments(app, note));
  }

  return true;
}

export function collectAttachmentsCurrentFolder(app: App, checking: boolean): boolean {
  const note = app.workspace.getActiveFile();
  if (!isNote(note)) {
    return false;
  }

  if (!checking) {
    invokeAsyncSafely(collectAttachmentsInFolder(app, note.parent!));
  }

  return true;
}

export function collectAttachmentsEntireVault(app: App): void {
  invokeAsyncSafely(collectAttachmentsInFolder(app, app.vault.getRoot()));
}

async function collectAttachments(app: App, note: TFile): Promise<void> {
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
        const attachmentMoveResult = await prepareAttachmentToMove(app, link, note.path);
        if (!attachmentMoveResult) {
          return null;
        }
        attachmentsMap.set(attachmentMoveResult.oldPath, attachmentMoveResult.newPath);
        return isCanvas ? null : {
          startIndex: link.position.start.offset,
          endIndex: link.position.end.offset,
          oldContent: link.original,
          newContent: attachmentMoveResult.newLink
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

    const newPathDir = dirname(newPath);
    await createFolderSafe(app, newPathDir);

    const backlinks = app.metadataCache.getBacklinksForFile(oldAttachmentFile);
    if (backlinks.count() === 0) {
      await app.vault.rename(oldAttachmentFile, newPath);
    } else {
      await app.vault.copy(oldAttachmentFile, newPath);
    }
  }

  notice.hide();
}

async function prepareAttachmentToMove(app: App, link: ReferenceCache, notePath: string): Promise<AttachmentMoveResult | null> {
  const { linkPath, subpath } = splitSubpath(link.link);
  let attachmentFile = app.metadataCache.getFirstLinkpathDest(linkPath, notePath);
  if (!attachmentFile) {
    return null;
  }

  if (isNote(attachmentFile)) {
    return null;
  }

  attachmentFile = attachmentFile as TFile;

  const newPath = await app.fileManager.getAvailablePathForAttachment(attachmentFile.name, notePath);
  const oldPath = attachmentFile.path;

  if (oldPath === newPath) {
    return null;
  }

  let newLink = app.fileManager.generateMarkdownLink(createTFile(app.vault, newPath), notePath, subpath, link.displayText);

  if (!link.original.startsWith("!")) {
    newLink = newLink.slice(1);
    newLink = newLink.replace("[]", `[${link.displayText}]`);
  }

  return {
    oldPath,
    newPath,
    newLink
  };
}

export async function collectAttachmentsInFolder(app: App, folder: TFolder): Promise<void> {
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
    await collectAttachments(app, file);
  }

  notice.hide();
}

function splitSubpath(link: string): SplitSubpathResult {
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
