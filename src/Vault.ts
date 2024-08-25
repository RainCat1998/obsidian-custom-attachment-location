import {
  Notice,
  TFile,
  TFolder,
  type App,
  type TAbstractFile
} from "obsidian";
import {
  deepEqual,
  toJson
} from "./Object.ts";
import {
  retryWithTimeout,
  type MaybePromise,
  type RetryOptions
} from "obsidian-dev-utils/Async";
import { getBacklinksForFileSafe } from "obsidian-dev-utils/obsidian/MetadataCache";
import { join } from "obsidian-dev-utils/Path";

export type FileChange = {
  startIndex: number;
  endIndex: number;
  oldContent: string;
  newContent: string;
};

export async function createFolderSafe(app: App, path: string, addGitKeep?: boolean): Promise<boolean> {
  let result: boolean;
  if (await app.vault.adapter.exists(path)) {
    result = false;
  } else {
    try {
      await app.vault.adapter.mkdir(path);
      result = true;
    } catch (e) {
      if (!await app.vault.adapter.exists(path)) {
        throw e;
      }

      result = true;
    }
  }

  if (addGitKeep) {
    const gitKeepPath = join(path, ".gitkeep");
    if (!await app.vault.adapter.exists(gitKeepPath)) {
      await app.vault.create(gitKeepPath, "");
    }
  }

  return result;
}

export function isNote(file: TAbstractFile | null): file is TFile {
  if (!(file instanceof TFile)) {
    return false;
  }

  const extension = file.extension.toLowerCase();
  return extension === "md" || extension === "canvas";
}

export async function processWithRetry(app: App, file: TFile, processFn: (content: string) => MaybePromise<string | null>, retryOptions: Partial<RetryOptions> = {}): Promise<void> {
  const DEFAULT_RETRY_OPTIONS: Partial<RetryOptions> = { timeoutInMilliseconds: 60000 };
  const overriddenOptions: Partial<RetryOptions> = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  await retryWithTimeout(async () => {
    const oldContent = await app.vault.adapter.read(file.path);
    const newContent = await processFn(oldContent);
    if (newContent === null) {
      return false;
    }
    let success = true;
    await app.vault.process(file, (content) => {
      if (content !== oldContent) {
        console.warn(`Content of ${file.path} has changed since it was read. Retrying...`);
        success = false;
        return content;
      }

      return newContent;
    });

    return success;
  }, overriddenOptions);
}

export async function applyFileChanges(app: App, file: TFile, changesFn: () => MaybePromise<FileChange[]>, retryOptions: Partial<RetryOptions> = {}): Promise<void> {
  const DEFAULT_RETRY_OPTIONS: Partial<RetryOptions> = { timeoutInMilliseconds: 60000 };
  const overriddenOptions: Partial<RetryOptions> = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  await processWithRetry(app, file, async (content) => {
    let changes = await changesFn();

    for (const change of changes) {
      const actualContent = content.slice(change.startIndex, change.endIndex);
      if (actualContent !== change.oldContent) {
        console.warn(`Content mismatch at ${change.startIndex}-${change.endIndex} in ${file.path}:\nExpected: ${change.oldContent}\nActual: ${actualContent}`);
        return null;
      }
    }

    changes.sort((a, b) => a.startIndex - b.startIndex);

    // BUG: https://forum.obsidian.md/t/bug-duplicated-links-in-metadatacache-inside-footnotes/85551
    changes = changes.filter((change, index) => {
      if (index === 0) {
        return true;
      }
      return !deepEqual(change, changes[index - 1]);
    });

    for (let i = 1; i < changes.length; i++) {
      const change = changes[i]!;
      const previousChange = changes[i - 1]!;
      if (previousChange.endIndex > change.startIndex) {
        console.warn(`Overlapping changes:\n${toJson(previousChange)}\n${toJson(change)}`);
        return null;
      }
    }

    let newContent = "";
    let lastIndex = 0;

    for (const change of changes) {
      newContent += content.slice(lastIndex, change.startIndex);
      newContent += change.newContent;
      lastIndex = change.endIndex;
    }

    newContent += content.slice(lastIndex);
    return newContent;
  }, overriddenOptions);
}

export async function removeFolderSafe(app: App, folderPath: string, removedNotePath?: string): Promise<boolean> {
  const folder = app.vault.getFolderByPath(folderPath);

  if (!folder) {
    return false;
  }

  let canRemove = true;

  for (const child of folder.children) {
    if (child instanceof TFile) {
      const backlinks = await getBacklinksForFileSafe(app, child);
      if (removedNotePath) {
        backlinks.removeKey(removedNotePath);
      }
      if (backlinks.count() !== 0) {
        new Notice(`Attachment ${child.path} is still used by other notes. It will not be deleted.`);
        canRemove = false;
      } else {
        try {
          await app.vault.delete(child);
        } catch (e) {
          if (await app.vault.adapter.exists(child.path)) {
            console.error(`Failed to delete ${child.path}`, e);
            canRemove = false;
          }
        }
      }
    } else if (child instanceof TFolder) {
      canRemove &&= await removeFolderSafe(app, child.path, removedNotePath);
    }
  }

  if (canRemove) {
    try {
      await app.vault.delete(folder, true);
    } catch (e) {
      if (await app.vault.adapter.exists(folder.path)) {
        console.error(`Failed to delete ${folder.path}`, e);
        canRemove = false;
      }
    }
  }

  return canRemove;
}

export async function removeEmptyFolderHierarchy(app: App, folder: TFolder | null): Promise<void> {
  while (folder) {
    if (folder.children.length > 0) {
      return;
    }
    await removeFolderSafe(app, folder.path);
    folder = folder.parent;
  }
}
