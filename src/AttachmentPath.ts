import moment from "moment";
import { escapeRegExp } from "./RegExp.ts";
import type CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import {
  normalizePath,
  type TAbstractFile,
  TFolder
} from "obsidian";
import { posix } from "@jinder/path";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";

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

  const filenameRegExp = /\$\{filename\}/g;
  // match ${filename} pattern
  regExpString = regExpString.replaceAll(filenameRegExp, escapeRegExp(targetFileName));

  return new RegExp(`^${regExpString}$`);
}

/**
 * example:
 *   /dir1/${date:YYYY}/${date:MM}/${filename} -> /dir1/2024/06/targetFileName
 * @param template template path contains meta vars
 * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to string path, using now time
 */
export function interpolateDateToString(template: string, targetFileName: string, settings: CustomAttachmentLocationPluginSettings): string {
  // match ${date:date_format} pattern
  const dateRegExp = /\$\{date:(.*?)\}/g;

  let newPath = template.replaceAll(dateRegExp, (_, dateFormat: string) => {
    // use moment to reformat date string
    const date = moment().format(dateFormat);
    return date;
  });

  const filenameRegExp = /\$\{filename\}/g;
  // match ${filename} pattern
  newPath = newPath.replaceAll(filenameRegExp, targetFileName);

  if (settings.toLowerCase) {
    newPath = newPath.toLowerCase();
  }

  if (settings.replaceWhitespace) {
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
    return interpolateDateToString(attachmentFolderTemplate, targetFileName, plugin.settings);
  }
}

export async function getAttachmentFolderPath(plugin: CustomAttachmentLocationPlugin, mdFileName: string): Promise<string> {
  return await getEarliestAttachmentFolder(plugin, plugin.settings.attachmentFolderPath, mdFileName);
}


export async function getAttachmentFolderFullPath(plugin: CustomAttachmentLocationPlugin, mdFolderPath: string, mdFileName: string): Promise<string> {
  let attachmentFolder = "";
  const useRelativePath = plugin.settings.attachmentFolderPath.startsWith("./");

  if (useRelativePath) {
    attachmentFolder = posix.join(mdFolderPath, await getAttachmentFolderPath(plugin, mdFileName));
  } else {
    attachmentFolder = await getAttachmentFolderPath(plugin, mdFileName);
  }
  return normalizePath(attachmentFolder);
}

export function getPastedImageFileName(plugin: CustomAttachmentLocationPlugin, mdFileName: string): string {
  return interpolateDateToString(plugin.settings.pastedImageFileName, mdFileName, plugin.settings);
}
