import type { App } from 'obsidian';
import type { MaybePromise } from 'obsidian-dev-utils/Async';

import moment from 'moment';
import { prompt } from 'obsidian-dev-utils/obsidian/Modal/Prompt';
import {
  basename,
  dirname,
  extname
} from 'obsidian-dev-utils/Path';
import {
  replaceAllAsync,
  trimEnd,
  trimStart
} from 'obsidian-dev-utils/String';

type Formatter = (substitutions: Substitutions, app: App, format: string) => MaybePromise<string>;

const MORE_THAN_TWO_DOTS_REG_EXP = /^\.{3,}$/;
const TRAILING_DOTS_AND_SPACES_REG_EXP = /[. ]+$/;
export const INVALID_FILENAME_PATH_CHARS_REG_EXP = /[\\/:*?"<>|]/;
export const SUBSTITUTION_TOKEN_REG_EXP = /\${(.+?)(?::(.+?))?}/g;

export class Substitutions {
  private static readonly formatters = new Map<string, Formatter>();
  static {
    this.registerFormatter('date', (substitutions, _app, format) => substitutions.formatDate(format));
    this.registerFormatter('fileName', (substitutions) => substitutions.fileName);
    this.registerFormatter('folderName', (substitutions) => substitutions.folderName);
    this.registerFormatter('folderPath', (substitutions) => substitutions.folderPath);
    this.registerFormatter('originalCopiedFileName', (substitutions) => substitutions.originalCopiedFileName);
    this.registerFormatter('prompt', (substitutions, app) => substitutions.prompt(app));
  }

  public readonly folderPath: string;
  private readonly fileName: string;
  private readonly folderName: string;
  private readonly originalCopiedFileName: string;

  public constructor(filePath: string, originalCopiedFileName?: string) {
    this.originalCopiedFileName = originalCopiedFileName ?? '';
    this.fileName = basename(filePath, extname(filePath));
    this.folderName = basename(dirname(filePath));
    this.folderPath = dirname(filePath);
  }

  public static isRegisteredToken(token: string): boolean {
    return Substitutions.formatters.has(token.toLowerCase());
  }

  private static registerFormatter(token: string, formatter: Formatter): void {
    this.formatters.set(token.toLowerCase(), formatter);
  }

  public async fillTemplate(app: App, template: string): Promise<string> {
    return await replaceAllAsync(template, SUBSTITUTION_TOKEN_REG_EXP, async (_: string, token: string, format: string) => {
      const formatter = Substitutions.formatters.get(token.toLowerCase());
      if (!formatter) {
        throw new Error(`Invalid token: ${token}`);
      }

      return await formatter(this, app, format);
    });
  }

  private formatDate(format: string): string {
    return moment().format(format);
  }

  private async prompt(app: App): Promise<string> {
    const promptResult = await prompt({
      app,
      defaultValue: this.originalCopiedFileName,
      title: 'Provide a value for ${prompt} template',
      valueValidator: (value) => validateFilename(value, false)
    });
    if (promptResult === null) {
      throw new Error('Prompt cancelled');
    }
    return promptResult;
  }
}

export function validateFilename(filename: string, areTokensAllowed: boolean = true): string {
  if (areTokensAllowed) {
    filename = removeTokenFormatting(filename);
    const unknownToken = validateTokens(filename);
    if (unknownToken) {
      return `Unknown token: ${unknownToken}`;
    }
  } else {
    const match = filename.match(SUBSTITUTION_TOKEN_REG_EXP);
    if (match) {
      return `Tokens are not allowed in file name`;
    }
  }

  if (filename === '.' || filename === '..') {
    return '';
  }

  if (!filename) {
    return 'File name is empty';
  }

  if (INVALID_FILENAME_PATH_CHARS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains invalid symbols`;
  }

  if (MORE_THAN_TWO_DOTS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains more than two dots`;
  }

  if (TRAILING_DOTS_AND_SPACES_REG_EXP.test(filename)) {
    return `File name "${filename}" contains trailing dots or spaces`;
  }

  return '';
}

export function validatePath(path: string): string {
  path = removeTokenFormatting(path);
  const unknownToken = validateTokens(path);
  if (unknownToken) {
    return `Unknown token: ${unknownToken}`;
  }

  path = trimStart(path, '/');
  path = trimEnd(path, '/');

  if (path === '') {
    return '';
  }

  const parts = path.split('/');
  for (const part of parts) {
    const partValidationError = validateFilename(part);

    if (partValidationError) {
      return partValidationError;
    }
  }

  return '';
}

function removeTokenFormatting(str: string): string {
  return str.replace(SUBSTITUTION_TOKEN_REG_EXP, (_, token: string) => `\${${token}}`);
}

function validateTokens(str: string): null | string {
  const matches = str.matchAll(SUBSTITUTION_TOKEN_REG_EXP);
  for (const match of matches) {
    const token = match[1] ?? '';
    if (!Substitutions.isRegisteredToken(token)) {
      return token;
    }
  }
  return null;
}
