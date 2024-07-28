import moment from "moment";
import { escapeRegExp } from "./RegExp.ts";
import {
  normalizePath,
  type TAbstractFile,
  TFolder
} from "obsidian";
import { posix } from "@jinder/path";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import prompt from "./Prompt.ts";
import { validateFilename } from "./PathValidator.ts";

/**
 * example:
 *   /dir/${date:YYYY}/${date:MM}/${filename} -> /^\/dir\/\d{4}\/\d{2}\/targetFileName$/
 * @param template raw path contains meta vars
 * @param targetFileName
 * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to regex
 */
export function interpolateToDigitRegex(template: string, targetFileName: string): RegExp {
  const dateRegExp = /\$\{date:(.*?)\}/g;
  // match ${date:date_format} pattern
  let regExpString = template.replaceAll(dateRegExp, (_, p1: string) => {
    // replace ${date} with \d{x} regex
    return `\\d{${p1.length}}`;
  });

  regExpString = regExpString.replaceAll("${filename}", escapeRegExp(targetFileName));

  return new RegExp(`^${regExpString}$`);
}

/**
 * example:
 *   /dir1/${date:YYYY}/${date:MM}/${filename} -> /dir1/2024/06/targetFileName
 * @param template template path contains meta vars
 * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to string path, using now time
 */
export async function interpolateDateToString(plugin: CustomAttachmentLocationPlugin, template: string, targetFileName: string, originalCopiedFilename?: string): Promise<string> {
  // match ${date:date_format} pattern
  const dateRegExp = /\$\{date:(.*?)\}/g;

  let newPath = template.replaceAll(dateRegExp, (_, dateFormat: string) => moment().format(dateFormat));

  newPath = newPath.replaceAll("${filename}", targetFileName);
  if (originalCopiedFilename) {
    newPath = newPath.replaceAll("${originalCopiedFilename}", originalCopiedFilename);

    if (newPath.includes("${prompt}")) {
      const newFileName = await prompt({
        app: plugin.app,
        title:"Rename attachment file",
        defaultValue: originalCopiedFilename,
        valueValidator: (value): string => {
          return validateFilename(value);
        }
      }) ?? originalCopiedFilename;
      newPath = newPath.replaceAll("${prompt}", newFileName);
    }
  }

  if (plugin.settings.toLowerCase) {
    newPath = newPath.toLowerCase();
  }

  if (plugin.settings.replaceWhitespace) {
    newPath = newPath.replace(/\s/g, "-");
    newPath = newPath.replace(/-{2,}/g, "-");
  }

  return newPath;
}

export async function getEarliestAttachmentFolder(plugin: CustomAttachmentLocationPlugin, attachmentFolderTemplate: string, targetFileName: string): Promise<string> {
  const app = plugin.app;
  const targetRegex = interpolateToDigitRegex(attachmentFolderTemplate, targetFileName);
  const folders = app.vault.getAllLoadedFiles()
    .filter((f: TAbstractFile) => f instanceof TFolder)
    .filter((f: TAbstractFile) => targetRegex.test(f.path));

  const folderStats = await Promise.all(folders.map(async (folder: TFolder) => {
    const stat = await app.vault.adapter.stat(posix.join(app.vault.adapter.getBasePath(), folder.path));
    return {
      path: folder.path,
      ctime: stat?.ctime ?? 0
    };
  }));

  if (folderStats.length > 0) {
    // create time ascending
    return folderStats.sort((a, b) => a.ctime - b.ctime).map(f => f.path)[0]!;
  } else {
    return interpolateDateToString(plugin, attachmentFolderTemplate, targetFileName);
  }
}

export async function getAttachmentFolderPath(plugin: CustomAttachmentLocationPlugin, noteFileName: string): Promise<string> {
  return await getEarliestAttachmentFolder(plugin, plugin.settings.attachmentFolderPath, noteFileName);
}

export async function getAttachmentFolderFullPath(plugin: CustomAttachmentLocationPlugin, noteFolderPath: string, noteFileName: string): Promise<string> {
  let attachmentFolder = "";
  const useRelativePath = plugin.settings.attachmentFolderPath.startsWith("./");

  if (useRelativePath) {
    attachmentFolder = posix.join(noteFolderPath, await getAttachmentFolderPath(plugin, noteFileName));
  } else {
    attachmentFolder = await getAttachmentFolderPath(plugin, noteFileName);
  }
  return normalizePath(attachmentFolder);
}

export async function getPastedFileName(plugin: CustomAttachmentLocationPlugin, noteFileName: string, originalCopiedFilename: string): Promise<string> {
  return await interpolateDateToString(plugin, plugin.settings.pastedFileName, noteFileName, originalCopiedFilename);
}

export function makeFileName(fileName: string, extension: string): string {
  return extension ? `${fileName}.${extension}` : fileName;
}
