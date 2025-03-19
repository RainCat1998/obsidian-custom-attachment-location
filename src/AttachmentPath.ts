import { normalizePath } from 'obsidian';
import { join } from 'obsidian-dev-utils/Path';
import { escapeRegExp } from 'obsidian-dev-utils/RegExp';

import type { CustomAttachmentLocationPlugin } from './CustomAttachmentLocationPlugin.ts';

import {
  Substitutions,
  validatePath
} from './Substitutions.ts';

export async function getAttachmentFolderFullPathForPath(
  plugin: CustomAttachmentLocationPlugin,
  notePath: string,
  attachmentFilename: string
): Promise<string> {
  return await getAttachmentFolderPath(plugin, new Substitutions(plugin.app, notePath, attachmentFilename));
}

export async function getPastedFileName(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await resolvePathTemplate(plugin, plugin.settings.generatedAttachmentFilename, substitutions);
}

export function replaceSpecialCharacters(plugin: CustomAttachmentLocationPlugin, str: string): string {
  if (!plugin.settings.specialCharacters) {
    return str;
  }

  str = str.replace(plugin.settings.specialCharactersRegExp, plugin.settings.specialCharactersReplacement);
  const escaped = escapeRegExp(plugin.settings.specialCharactersReplacement);
  str = str.replace(new RegExp(`${escaped}{2,}`, 'g'), plugin.settings.specialCharactersReplacement);
  return str;
}

async function getAttachmentFolderPath(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await resolvePathTemplate(plugin, plugin.settings.attachmentFolderPath, substitutions);
}

async function resolvePathTemplate(plugin: CustomAttachmentLocationPlugin, template: string, substitutions: Substitutions): Promise<string> {
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
    resolvedPath = join(substitutions.folderPath, resolvedPath);
  }

  resolvedPath = normalizePath(resolvedPath);
  return resolvedPath;
}
