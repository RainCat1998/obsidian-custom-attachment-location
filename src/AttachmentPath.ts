import type { FileStats } from 'obsidian';

import {
  normalizePath,
  Notice
} from 'obsidian';
import { printError } from 'obsidian-dev-utils/Error';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import { join } from 'obsidian-dev-utils/Path';

import type { Plugin } from './Plugin.ts';

import {
  Substitutions,
  TokenValidationMode,
  validateFileName,
  validatePath
} from './Substitutions.ts';
import { ActionContext } from './TokenEvaluatorContext.ts';

export async function getAttachmentFolderFullPathForPath(
  plugin: Plugin,
  actionContext: ActionContext,
  notePath: string,
  attachmentFileName: string,
  oldNoteFilePath?: string,
  attachmentFileContent?: ArrayBuffer,
  attachmentFileStat?: FileStats
): Promise<string> {
  return await getAttachmentFolderPath(
    plugin,
    new Substitutions({
      actionContext,
      attachmentFileContent,
      attachmentFileStat,
      noteFilePath: notePath,
      oldNoteFilePath,
      originalAttachmentFileName: attachmentFileName,
      plugin
    })
  );
}

export async function getGeneratedAttachmentFileBaseName(plugin: Plugin, substitutions: Substitutions): Promise<string> {
  let baseTemplate: string;
  switch (substitutions.actionContext) {
    case ActionContext.CollectAttachments:
      baseTemplate = plugin.settings.collectedAttachmentFileName;
      break;
    case ActionContext.RenameNote:
      baseTemplate = plugin.settings.renamedAttachmentFileName;
      break;
    default:
      baseTemplate = plugin.settings.generatedAttachmentFileName;
      break;
  }

  baseTemplate ||= plugin.settings.generatedAttachmentFileName;

  const path = await resolvePathTemplate(plugin, baseTemplate, substitutions, true);
  let validationMessage = await validatePath({
    areTokensAllowed: false,
    path,
    plugin
  });
  if (!validationMessage) {
    const parts = path.split('/');
    const fileName = parts.at(-1) ?? '';
    // eslint-disable-next-line require-atomic-updates -- Ignore possible race condition.
    validationMessage = await validateFileName({
      areSingleDotsAllowed: false,
      fileName,
      isEmptyAllowed: false,
      plugin,
      tokenValidationMode: TokenValidationMode.Error
    });
  }
  if (validationMessage) {
    new Notice(createFragment((f) => {
      f.appendText(t(($) => $.notice.generatedAttachmentFileNameIsInvalid.part1, { path, validationMessage }));
      f.appendText(' ');
      appendCodeBlock(f, t(($) => $.pluginSettingsTab.generatedAttachmentFileName.name));
      f.appendText(' ');
      f.appendText(t(($) => $.notice.generatedAttachmentFileNameIsInvalid.part2));
    }));
    const errorMessage = `Generated attachment file name "${path}" is invalid.\n${validationMessage}\nCheck your 'Generated attachment file name' setting.`;
    console.error(errorMessage, substitutions);
    throw new Error(errorMessage);
  }
  return path;
}

function cleanFilePathPart(plugin: Plugin, part: string): string {
  let cleanPart = part.trimEnd();
  if (cleanPart === '.' || cleanPart === '..') {
    return cleanPart;
  }

  cleanPart = cleanPart.replace(/[\s.]+$/, '');
  cleanPart = plugin.replaceSpecialCharacters(cleanPart);
  return cleanPart;
}

async function getAttachmentFolderPath(plugin: Plugin, substitutions: Substitutions): Promise<string> {
  return await resolvePathTemplate(plugin, plugin.settings.attachmentFolderPath, substitutions, false);
}

function isRelativePath(path: string): boolean {
  return path === '.' || path.startsWith('./') || path === '..' || path.startsWith('../');
}

async function resolvePathTemplate(plugin: Plugin, template: string, substitutions: Substitutions, isFileNamePart: boolean): Promise<string> {
  try {
    let resolvedPath = await substitutions.fillTemplate(template);
    const resolvedPathParts = resolvedPath.split('/').map((part) => cleanFilePathPart(plugin, part));
    resolvedPath = resolvedPathParts.join('/');

    const validationError = await validatePath({
      areTokensAllowed: false,
      path: resolvedPath,
      plugin
    });
    if (validationError) {
      throw new Error(`Resolved path ${resolvedPath} is invalid: ${validationError}`);
    }

    if (!isFileNamePart) {
      if (isRelativePath(resolvedPath)) {
        resolvedPath = join(substitutions.noteFolderPath, resolvedPath);
      }

      resolvedPath = normalizePath(resolvedPath);
    }

    if (resolvedPath === '.') {
      resolvedPath = '';
    }

    if (isRelativePath(resolvedPath)) {
      throw new Error('Resolved path should be absolute');
    }

    return resolvedPath;
  } catch (error) {
    new Notice(t(($) => $.notice.couldNotResolveTemplatePath, { template }));
    console.error('Could not resolve template path', {
      substitutions,
      template
    });
    printError(error);
    throw error;
  }
}
