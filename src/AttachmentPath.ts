import { normalizePath } from 'obsidian';
import { join } from 'obsidian-dev-utils/Path';

import type { Plugin } from './Plugin.ts';

import {
  Substitutions,
  validatePath
} from './Substitutions.ts';

export async function getAttachmentFolderFullPathForPath(
  plugin: Plugin,
  notePath: string,
  attachmentFilename: string
): Promise<string> {
  return await getAttachmentFolderPath(
    plugin,
    new Substitutions({
      app: plugin.app,
      noteFilePath: notePath,
      originalAttachmentFileName: attachmentFilename
    })
  );
}

export async function getPastedFileName(plugin: Plugin, substitutions: Substitutions): Promise<string> {
  return await resolvePathTemplate(plugin, plugin.settings.generatedAttachmentFilename, substitutions);
}

export function replaceSpecialCharacters(plugin: Plugin, str: string): string {
  if (!plugin.settings.specialCharacters) {
    return str;
  }

  str = str.replace(plugin.settings.specialCharactersRegExp, plugin.settings.specialCharactersReplacement);
  return str;
}

async function getAttachmentFolderPath(plugin: Plugin, substitutions: Substitutions): Promise<string> {
  return await resolvePathTemplate(plugin, plugin.settings.attachmentFolderPath, substitutions);
}

async function resolvePathTemplate(plugin: Plugin, template: string, substitutions: Substitutions): Promise<string> {
  let resolvedPath = await substitutions.fillTemplate(template);
  const validationError = validatePath(resolvedPath, false);
  if (validationError) {
    throw new Error(`Resolved path ${resolvedPath} is invalid: ${validationError}`);
  }

  if (plugin.settings.shouldRenameAttachmentsToLowerCase) {
    resolvedPath = resolvedPath.toLowerCase();
  }

  resolvedPath = replaceSpecialCharacters(plugin, resolvedPath);
  if (resolvedPath.startsWith('./') || resolvedPath.startsWith('../')) {
    resolvedPath = join(substitutions.noteFolderPath, resolvedPath);
  }

  resolvedPath = normalizePath(resolvedPath);
  return resolvedPath;
}
