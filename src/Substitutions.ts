import type {
  App,
  TFile
} from 'obsidian';
import type { Promisable } from 'type-fest';

import moment from 'moment';
import { getNestedPropertyValue } from 'obsidian-dev-utils/Object';
import { getFileOrNull } from 'obsidian-dev-utils/obsidian/FileSystem';
import { prompt } from 'obsidian-dev-utils/obsidian/Modals/Prompt';
import {
  basename,
  dirname,
  extname
} from 'obsidian-dev-utils/Path';
import {
  replaceAll,
  replaceAllAsync,
  trimEnd,
  trimStart
} from 'obsidian-dev-utils/String';

type Formatter = (substitutions: Substitutions, format: string) => Promisable<unknown>;

const MORE_THAN_TWO_DOTS_REG_EXP = /^\.{3,}$/;
const TRAILING_DOTS_AND_SPACES_REG_EXP = /[. ]+$/;
export const INVALID_FILENAME_PATH_CHARS_REG_EXP = /[\\/:*?"<>|]/;
export const SUBSTITUTION_TOKEN_REG_EXP = /\${(?<Token>.+?)(?::(?<Format>.+?))?}/g;

export function getCustomTokenFormatters(customTokensStr: string): Map<string, Formatter> | null {
  const formatters = new Map<string, Formatter>();
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const customTokenInitFn = new Function('exports', customTokensStr) as (exports: object) => void;
    const exports = {};
    customTokenInitFn(exports);
    for (const [token, formatter] of Object.entries(exports)) {
      formatters.set(token, formatter as Formatter);
    }
    return formatters;
  } catch (e) {
    throw new Error('Error initializing custom token formatters', { cause: e });
  }
}

function formatDate(format: string): string {
  return moment().format(format);
}

function formatFileDate(app: App, filePath: string, format: string, getTimestamp: (file: TFile) => number): string {
  const file = getFileOrNull(app, filePath);
  if (!file) {
    return '';
  }
  return moment(getTimestamp(file)).format(format);
}

function generateRandomDigit(): string {
  return generateRandomSymbol('0123456789');
}

function generateRandomDigitOrLetter(): string {
  return generateRandomSymbol('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

function generateRandomLetter(): string {
  return generateRandomSymbol('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

function generateUuid(): string {
  return crypto.randomUUID();
}

function getFrontmatterValue(app: App, filePath: string, key: string): string {
  const file = getFileOrNull(app, filePath);
  if (!file) {
    return '';
  }

  const cache = app.metadataCache.getFileCache(file);

  if (!cache?.frontmatter) {
    return '';
  }

  const value = getNestedPropertyValue(cache.frontmatter, key) ?? '';
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
}

export class Substitutions {
  private static readonly formatters = new Map<string, Formatter>();

  static {
    this.registerCustomFormatters('');
  }

  public readonly fileName: string;

  public readonly folderName: string;
  public readonly folderPath: string;
  public readonly originalCopiedFileExtension: string;
  public constructor(private readonly app: App, private readonly filePath: string, private readonly originalCopiedFileName = '') {
    this.fileName = basename(filePath, extname(filePath));
    this.folderName = basename(dirname(filePath));
    this.folderPath = dirname(filePath);

    const originalCopiedFileExtension = extname(originalCopiedFileName);
    this.originalCopiedFileName = basename(originalCopiedFileName, originalCopiedFileExtension);
    this.originalCopiedFileExtension = originalCopiedFileExtension.slice(1);
  }

  public static isRegisteredToken(token: string): boolean {
    return Substitutions.formatters.has(token.toLowerCase());
  }

  public static registerCustomFormatters(customTokensStr: string): void {
    this.formatters.clear();
    this.registerFormatter('date', (_substitutions, format) => formatDate(format));
    this.registerFormatter(
      'fileCreationDate',
      (substitutions, format) => formatFileDate(substitutions.app, substitutions.filePath, format, (file) => file.stat.ctime)
    );
    this.registerFormatter(
      'fileModificationDate',
      (substitutions, format) => formatFileDate(substitutions.app, substitutions.filePath, format, (file) => file.stat.mtime)
    );
    this.registerFormatter('fileName', (substitutions) => substitutions.fileName);
    this.registerFormatter('filePath', (substitutions) => substitutions.filePath);
    this.registerFormatter('folderName', (substitutions) => substitutions.folderName);
    this.registerFormatter('folderPath', (substitutions) => substitutions.folderPath);
    this.registerFormatter('frontmatter', (substitutions, key) => getFrontmatterValue(substitutions.app, substitutions.filePath, key));
    this.registerFormatter('originalCopiedFileExtension', (substitutions) => substitutions.originalCopiedFileExtension);
    this.registerFormatter('originalCopiedFileName', (substitutions) => substitutions.originalCopiedFileName);
    this.registerFormatter('prompt', (substitutions) => substitutions.prompt());
    this.registerFormatter('randomDigit', () => generateRandomDigit());
    this.registerFormatter('randomDigitOrLetter', () => generateRandomDigitOrLetter());
    this.registerFormatter('randomLetter', () => generateRandomLetter());
    this.registerFormatter('uuid', () => generateUuid());

    const customFormatters = getCustomTokenFormatters(customTokensStr) ?? new Map<string, Formatter>();
    for (const [token, formatter] of customFormatters.entries()) {
      this.registerFormatter(token, formatter);
    }
  }

  private static registerFormatter(token: string, formatter: Formatter): void {
    this.formatters.set(token.toLowerCase(), formatter);
  }

  public async fillTemplate(template: string): Promise<string> {
    return await replaceAllAsync(template, SUBSTITUTION_TOKEN_REG_EXP, async (_, token, format) => {
      const formatter = Substitutions.formatters.get(token.toLowerCase());
      if (!formatter) {
        throw new Error(`Invalid token: ${token}`);
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        return String(await formatter(this, format) ?? '');
      } catch (e) {
        throw new Error(`Error formatting token \${${token}}`, { cause: e });
      }
    });
  }

  private async prompt(): Promise<string> {
    const promptResult = await prompt({
      app: this.app,
      defaultValue: this.originalCopiedFileName,
      // eslint-disable-next-line no-template-curly-in-string
      title: 'Provide a value for ${prompt} template',
      valueValidator: (value) => validateFilename(value, false)
    });
    if (promptResult === null) {
      throw new Error('Prompt cancelled');
    }
    return promptResult;
  }
}

export function validateFilename(filename: string, areTokensAllowed = true): string {
  if (areTokensAllowed) {
    filename = removeTokenFormatting(filename);
    const unknownToken = validateTokens(filename);
    if (unknownToken) {
      return `Unknown token: ${unknownToken}`;
    }
  } else {
    const match = filename.match(SUBSTITUTION_TOKEN_REG_EXP);
    if (match) {
      return 'Tokens are not allowed in file name';
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

export function validatePath(path: string, areTokensAllowed = true): string {
  if (areTokensAllowed) {
    path = removeTokenFormatting(path);
    const unknownToken = validateTokens(path);
    if (unknownToken) {
      return `Unknown token: ${unknownToken}`;
    }
  } else {
    const match = path.match(SUBSTITUTION_TOKEN_REG_EXP);
    if (match) {
      return 'Tokens are not allowed in path';
    }
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

function generateRandomSymbol(symbols: string): string {
  return symbols[Math.floor(Math.random() * symbols.length)] ?? '';
}

function removeTokenFormatting(str: string): string {
  return replaceAll(str, SUBSTITUTION_TOKEN_REG_EXP, (_, token) => `\${${token}}`);
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
