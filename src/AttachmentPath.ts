import { normalizePath } from 'obsidian';
import { join } from 'obsidian-dev-utils/Path';

import type { Plugin } from './Plugin.ts';

import {
  Substitutions,
  TokenValidationMode,
  validateFileName,
  validatePath
} from './Substitutions.ts';

export async function getAttachmentFolderFullPathForPath(
  plugin: Plugin,
  notePath: string,
  attachmentFileName: string,
  attachmentFileContent?: ArrayBuffer
): Promise<string> {
  return await getAttachmentFolderPath(
    plugin,
    new Substitutions({
      app: plugin.app,
      attachmentFileContent,
      noteFilePath: notePath,
      originalAttachmentFileName: attachmentFileName
    })
  );
}

export async function getGeneratedAttachmentFileName(plugin: Plugin, substitutions: Substitutions): Promise<string> {
  const fileName = await resolvePathTemplate(plugin, plugin.settings.generatedAttachmentFileName, substitutions);
  const validationMessage = await validateFileName({
    app: plugin.app,
    areSingleDotsAllowed: true,
    fileName,
    isEmptyAllowed: false,
    tokenValidationMode: TokenValidationMode.Skip
  });
  if (validationMessage) {
    throw new Error(`Generated attachment file name ${fileName} is invalid: ${validationMessage}`);
  }
  return fileName;
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
  const validationError = await validatePath({
    app: plugin.app,
    areTokensAllowed: false,
    path: resolvedPath
  });
  if (validationError) {
    throw new Error(`Resolved path ${resolvedPath} is invalid: ${validationError}`);
  }

  resolvedPath = replaceSpecialCharacters(plugin, resolvedPath);
  if (resolvedPath.startsWith('./') || resolvedPath.startsWith('../')) {
    resolvedPath = join(substitutions.noteFolderPath, resolvedPath);
  }

  resolvedPath = normalizePath(resolvedPath);
  return resolvedPath;
}
