import type { TAbstractFile } from 'obsidian';

import moment from 'moment';
import { TFolder } from 'obsidian';
import { throwExpression } from 'obsidian-dev-utils/Error';
import { prompt } from 'obsidian-dev-utils/obsidian/Modal/Prompt';
import { escapeRegExp } from 'obsidian-dev-utils/RegExp';

import type CustomAttachmentLocationPlugin from './CustomAttachmentLocationPlugin.ts';
import type { Substitutions } from './Substitutions.ts';

import { validateFilename } from './PathValidator.ts';
import { createSubstitutionsFromPath } from './Substitutions.ts';

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
    return `\\d{${p1.length.toString()}}`;
  });

  for (const [key, value] of Object.entries(substitutions) as [string, string][]) {
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

  for (const [key, value] of Object.entries(substitutions) as [string, string][]) {
    newPath = newPath.replaceAll(`\${${key}}`, value);
  }

  if (substitutions.originalCopiedFilename) {
    if (newPath.includes('${prompt}')) {
      const newFileName = await prompt({
        app: plugin.app,
        defaultValue: substitutions.originalCopiedFilename,
        title: 'Rename attachment file',
        valueValidator: (value): string => {
          return validateFilename(value);
        }
      }) ?? substitutions.originalCopiedFilename;
      newPath = newPath.replaceAll('${prompt}', newFileName);
    }
  }

  if (plugin.settingsCopy.toLowerCase) {
    newPath = newPath.toLowerCase();
  }

  newPath = replaceWhitespace(plugin, newPath);
  newPath = newPath.replace(/\.\//, substitutions.folderPath + '/');
  return newPath;
}

export async function getEarliestAttachmentFolder(plugin: CustomAttachmentLocationPlugin, attachmentFolderTemplate: string, substitutions: Substitutions): Promise<string> {
  const app = plugin.app;
  const targetRegex = interpolateToDigitRegex(attachmentFolderTemplate, substitutions);
  const folders = app.vault.getAllLoadedFiles()
    .filter((f: TAbstractFile) => f instanceof TFolder)
    .filter((f: TAbstractFile) => targetRegex.test(f.path));

  interface FolderStat {
    ctime: number;
    path: string;
  }

  const folderStats: FolderStat[] = [];

  for (const folder of folders) {
    const stat = await app.vault.adapter.stat(folder.path);
    folderStats.push({
      ctime: stat?.ctime ?? 0,
      path: folder.path
    });
  }

  if (folderStats.length > 0) {
    // create time ascending
    return folderStats.sort((a, b) => a.ctime - b.ctime).map((f) => f.path)[0] ?? throwExpression(new Error('No folder stat'));
  } else {
    return interpolateDateToString(plugin, attachmentFolderTemplate, substitutions);
  }
}

export async function getAttachmentFolderPath(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await getEarliestAttachmentFolder(plugin, plugin.settingsCopy.attachmentFolderPath, substitutions);
}

export async function getAttachmentFolderFullPathForPath(plugin: CustomAttachmentLocationPlugin, path: string): Promise<string> {
  return await getAttachmentFolderPath(plugin, createSubstitutionsFromPath(path));
}

export async function getPastedFileName(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await interpolateDateToString(plugin, plugin.settingsCopy.pastedFileName, substitutions);
}

export function replaceWhitespace(plugin: CustomAttachmentLocationPlugin, str: string): string {
  if (plugin.settingsCopy.replaceWhitespace) {
    str = str.replace(/\s/g, '-');
    str = str.replace(/-{2,}/g, '-');
  }

  return str;
}
