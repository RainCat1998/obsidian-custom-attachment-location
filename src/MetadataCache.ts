import type {
  App,
  CachedMetadata,
  LinkCache,
  MarkdownView,
  ReferenceCache,
  TFile
} from "obsidian";
import {
  retryWithTimeout,
  type RetryOptions
} from "./Async.ts";
import type { CustomArrayDict } from "obsidian-typings";

export async function getCacheSafe(app: App, fileOrPath: TFile | string, retryOptions: Partial<RetryOptions> = {}): Promise<CachedMetadata | null> {
  const DEFAULT_RETRY_OPTIONS: Partial<RetryOptions> = { timeoutInMilliseconds: 60000 };
  const overriddenOptions: Partial<RetryOptions> = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  let cache: CachedMetadata | null = null;

  await retryWithTimeout(async () => {
    const file = typeof fileOrPath === "string" ? app.vault.getFileByPath(fileOrPath) : fileOrPath;

    if (!file) {
      cache = null;
      return true;
    }

    await saveNote(app, file);

    const fileInfo = app.metadataCache.getFileInfo(file.path);
    const stat = await app.vault.adapter.stat(file.path);

    if (!fileInfo) {
      console.debug(`File cache info for ${file.path} is missing`);
      return false;
    } else if (!stat) {
      console.debug(`File stat for ${file.path} is missing`);
      return false;
    } else if (fileInfo.mtime < stat.mtime) {
      console.debug(`File cache info for ${file.path} is from ${new Date(fileInfo.mtime).toString()} which is older than the file modification timestamp ${new Date(stat.mtime).toString()}`);
      return false;
    } else {
      cache = app.metadataCache.getFileCache(file);
      if (!cache) {
        console.debug(`File cache for ${file.path} is missing`);
        return false;
      } else {
        return true;
      }
    }
  }, overriddenOptions);

  return cache;
}

export function getAllLinks(cache: CachedMetadata): ReferenceCache[] {
  let links: ReferenceCache[] = [];

  if (cache.links) {
    links.push(...cache.links);
  }

  if (cache.embeds) {
    links.push(...cache.embeds);
  }

  links.sort((a, b) => a.position.start.offset - b.position.start.offset);

  // BUG: https://forum.obsidian.md/t/bug-duplicated-links-in-metadatacache-inside-footnotes/85551
  links = links.filter((link, index) => {
    if (index === 0) {
      return true;
    }
    return link.position.start.offset !== links[index - 1]!.position.start.offset;
  });

  return links;
}

export async function getBacklinksForFileSafe(app: App, file: TFile, retryOptions: Partial<RetryOptions> = {}): Promise<CustomArrayDict<LinkCache>> {
  const DEFAULT_RETRY_OPTIONS: Partial<RetryOptions> = { timeoutInMilliseconds: 60000 };
  const overriddenOptions: Partial<RetryOptions> = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  let backlinks: CustomArrayDict<LinkCache> | null = null;
  await retryWithTimeout(async () => {
    backlinks = app.metadataCache.getBacklinksForFile(file);
    for (const notePath of backlinks.keys()) {
      const note = app.vault.getFileByPath(notePath);
      if (!note) {
        return false;
      }

      await saveNote(app, note);

      const content = await app.vault.read(note);
      const links = backlinks.get(notePath)!;
      for (const link of links) {
        const actualLink = content.slice(link.position.start.offset, link.position.end.offset);
        if (actualLink !== link.original) {
          return false;
        }
      }
    }

    return true;
  }, overriddenOptions);

  return backlinks!;
}

async function saveNote(app: App, note: TFile): Promise<void> {
  if (note.extension.toLowerCase() !== "md") {
    return;
  }

  for (const leaf of app.workspace.getLeavesOfType("markdown")) {
    const view = leaf.view as MarkdownView;
    if (view.file?.path === note.path) {
      await view.save();
    }
  }
}
