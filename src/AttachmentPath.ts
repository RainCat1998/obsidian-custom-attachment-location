import moment from 'moment';
import { normalizePath } from 'obsidian';
import { prompt } from 'obsidian-dev-utils/obsidian/Modal/Prompt';
import { join } from 'obsidian-dev-utils/Path';
import {
  replaceAllAsync,
  trimStart
} from 'obsidian-dev-utils/String';

import type { CustomAttachmentLocationPlugin } from './CustomAttachmentLocationPlugin.ts';
import type { Substitutions } from './Substitutions.ts';

import { validateFilename } from './PathValidator.ts';
import { createSubstitutionsFromPath } from './Substitutions.ts';

export async function getAttachmentFolderFullPathForPath(plugin: CustomAttachmentLocationPlugin, path: string): Promise<string> {
  return await getAttachmentFolderPath(plugin, createSubstitutionsFromPath(path));
}

export async function getPastedFileName(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await resolvePathTemplate(plugin, plugin.settingsCopy.pastedFileName, substitutions);
}

export function replaceWhitespace(plugin: CustomAttachmentLocationPlugin, str: string): string {
  if (plugin.settingsCopy.replaceWhitespace) {
    str = str.replace(/\s/g, '-');
    str = str.replace(/-{2,}/g, '-');
  }

  return str;
}

async function getAttachmentFolderPath(plugin: CustomAttachmentLocationPlugin, substitutions: Substitutions): Promise<string> {
  return await resolvePathTemplate(plugin, plugin.settingsCopy.attachmentFolderPath, substitutions);
}

async function resolvePathTemplate(plugin: CustomAttachmentLocationPlugin, template: string, substitutions: Substitutions): Promise<string> {
  let resolvedPath = await replaceAllAsync(template, /\${(.+?)}/g, async (_: string, key: string) => {
    if (key.startsWith('date:')) {
      const format = trimStart(key, 'date:');
      return moment().format(format);
    }
    if (key in substitutions) {
      return substitutions[key as keyof Substitutions];
    }
    if (key === 'prompt') {
      const promptResult = await prompt({
        app: plugin.app,
        defaultValue: substitutions.originalCopiedFilename,
        title: 'Provide a value for ${prompt} template',
        valueValidator: validateFilename
      });
      if (promptResult === null) {
        throw new Error('Prompt cancelled');
      }
      return promptResult;
    }

    throw new Error(`Unknown key: ${key}`);
  });

  if (plugin.settingsCopy.toLowerCase) {
    resolvedPath = resolvedPath.toLowerCase();
  }

  resolvedPath = replaceWhitespace(plugin, resolvedPath);
  if (resolvedPath.startsWith('./')) {
    resolvedPath = join(substitutions.folderPath, resolvedPath);
  }

  resolvedPath = normalizePath(resolvedPath);
  return resolvedPath;
}
