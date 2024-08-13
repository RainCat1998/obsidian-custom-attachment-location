import moment from "moment";
import { escapeRegExp } from "./RegExp.ts";
import {
  normalizePath,
  type TAbstractFile,
  TFolder
} from "obsidian";
import { posix } from "@jinder/path";
const { join } = posix;
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import prompt from "./Prompt.ts";
import { validateFilename } from "./PathValidator.ts";
import {
  createSubstitutionsFromPath,
  type Substitutions
} from "./Substitutions.ts";

/**
 * example:
 *   /dir/${date:YYYY}/${date:MM}/${filename} -> /^\/dir\/\d{4}\/\d{2}\/targetFileName$/
 * @param template raw path contains meta vars
 * @param targetFileName
 * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to regex
 */
export function interpolateToDigitRegex(template: string, substitutions: Substitutions): RegExp {
  const dateRegExp = /\$\{date:(.*?)\}/g;
  // match ${date:date_format} pattern
  let regExpString = template.replaceAll(dateRegExp, (_, p1: string) => {
    // replace ${date} with \d{x} regex
    return `\\d{${p1.length}}`;
  });

  for (const [key, value] of Object.entries(substitutions)) {
    regExpString = regExpString.replaceAll(`\${${key}}`, escapeRegExp(value));
  }

  return new RegExp(`^${regExpString}$`);
}

/**
 * example:
 *   /dir1/${date:YYYY}/${date:MM}/${filename} -> /dir1/2024/06/targetFileName
 * @param template template path contains meta vars
 * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to string path, using now time
 */
export async function interpolateDateToString(plugin: CustomAttachmentLocationPlugin, template: string, substitutions: Substitutions): Promise<string> {
  // match ${date:date_format} pattern
  const dateRegExp = /\$\{date:(.*?)\}/g;

  let newPath = template.replaceAll(dateRegExp, (_, dateFormat: string) => moment().format(dateFormat));

  for (const [key, value] of Object.entries(substitutions)) {
    newPath = newPath.replaceAll(`\${${key}}`, value);
  }

  if (substitutions.originalCopiedFilename) {
    if (newPath.includes("${prompt}")) {
      const newFileName = await prompt({
        app: plugin.app,
        title: "Rename attachment file",
        defaultValue: substitutions.originalCopiedFilename,
        valueValidator: (value): string => {
          return validateFilename(value);
        }
      }) ?? substitutions.originalCopiedFilename;
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

export async function getEarliestAttachmentFolder(plugin: CustomAttachmentLocationPlugin, attachmentFolderTemplate: string, substitutions: Substitutions): Promise<string> {
  const app = plugin.app;
  const targetRegex = interpolateToDigitRegex(attachmentFolderTemplate, substitutions);
  const folders = app.vault.getAllLoadedFiles()
    .filter((f: TAbstractFile) => f instanceof TFolder)
    .filter((f: TAbstractFile) => targetRegex.test(f.path));

  type FolderStat = {
    path: string,
    ctime: number
  };

  const folderStats: FolderStat[] = [];

  for (const folder of folders) {
    const stat = await app.vault.adapter.stat(join(app.vault.adapter.getBasePath(), folder.path));
    folderStats.push({
      path: folder.path,
      ctime: stat?.ctime ?? 0
    });
  }

  if (folderStats.length > 0) {
    // create time ascending
    return folderStats.sort((a, b) => a.ctime - b.ctime).map(f => f.path)[0]!;
  } else {
    return interpolateDateToString(plugin, attachmentFolderTemplate, substitutions);
  }
}

export async function getAttachmentFolderPath(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await getEarliestAttachmentFolder(plugin, plugin.settings.attachmentFolderPath, substitutions);
}

async function getAttachmentFolderFullPathForSubstitutions(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  let attachmentFolder = "";
  const useRelativePath = plugin.settings.attachmentFolderPath.startsWith("./");

  if (useRelativePath) {
    attachmentFolder = join(substitutions.folderPath, await getAttachmentFolderPath(plugin, substitutions));
  } else {
    attachmentFolder = await getAttachmentFolderPath(plugin, substitutions);
  }
  return normalizePath(attachmentFolder);
}

export async function getAttachmentFolderFullPathForPath(plugin: CustomAttachmentLocationPlugin, path: string): Promise<string> {
  return await getAttachmentFolderFullPathForSubstitutions(plugin, createSubstitutionsFromPath(path));
}

export async function getPastedFileName(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await interpolateDateToString(plugin, plugin.settings.pastedFileName, substitutions);
}

export function makeFileName(fileName: string, extension: string): string {
  return extension ? `${fileName}.${extension}` : fileName;
}
