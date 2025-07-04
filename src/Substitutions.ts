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

interface SubstitutionsOptions {
  app: App;
  attachmentFileSizeInBytes?: number;
  noteFilePath: string;
  originalAttachmentFileName?: string;
}

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

function formatFileDate(app: App, noteFilePath: string, format: string, getTimestamp: (file: TFile) => number): string {
  const noteFile = getFileOrNull(app, noteFilePath);
  if (!noteFile) {
    return '';
  }
  return moment(getTimestamp(noteFile)).format(format);
}

function formatFileSize(sizeInBytes: number, format?: string): string {
  const BYTES_IN_KB = 1024;
  const BYTES_IN_MB = BYTES_IN_KB * BYTES_IN_KB;

  switch (format) {
    case 'B':
    case undefined:
      return String(sizeInBytes);
    case 'KB':
      return String(Math.floor(sizeInBytes / BYTES_IN_KB));
    case 'MB':
      return String(Math.floor(sizeInBytes / BYTES_IN_MB));
    default:
      throw new Error(`Invalid file size format: ${format}`);
  }
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

  public readonly noteFolderPath: string;

  private readonly app: App;

  private attachmentFileSizeInBytes: number;
  private readonly noteFileName: string;
  private readonly noteFilePath: string;
  private readonly noteFolderName: string;
  private readonly originalAttachmentFileExtension: string;
  private readonly originalAttachmentFileName: string;

  public constructor(options: SubstitutionsOptions) {
    this.app = options.app;

    this.noteFilePath = options.noteFilePath;
    this.noteFileName = basename(this.noteFilePath, extname(this.noteFilePath));
    this.noteFolderName = basename(dirname(this.noteFilePath));
    this.noteFolderPath = dirname(this.noteFilePath);

    const originalAttachmentFileName = options.originalAttachmentFileName ?? '';
    const originalAttachmentFileExtension = extname(originalAttachmentFileName);
    this.originalAttachmentFileName = basename(originalAttachmentFileName, originalAttachmentFileExtension);
    this.originalAttachmentFileExtension = originalAttachmentFileExtension.slice(1);

    this.attachmentFileSizeInBytes = options.attachmentFileSizeInBytes ?? 0;
  }

  public static isRegisteredToken(token: string): boolean {
    return Substitutions.formatters.has(token.toLowerCase());
  }

  public static registerCustomFormatters(customTokensStr: string): void {
    this.formatters.clear();
    this.registerFormatter('date', (_substitutions, format) => formatDate(format));
    this.registerFormatter(
      'noteFileCreationDate',
      (substitutions, format) => formatFileDate(substitutions.app, substitutions.noteFilePath, format, (file) => file.stat.ctime)
    );
    this.registerFormatter(
      'noteFileModificationDate',
      (substitutions, format) => formatFileDate(substitutions.app, substitutions.noteFilePath, format, (file) => file.stat.mtime)
    );

    this.registerFormatter('noteFileName', (substitutions) => substitutions.noteFileName);
    this.registerFormatter('noteFilePath', (substitutions) => substitutions.noteFilePath);
    this.registerFormatter('noteFolderName', (substitutions) => substitutions.noteFolderName);
    this.registerFormatter('noteFolderPath', (substitutions) => substitutions.noteFolderPath);

    this.registerFormatter('frontmatter', (substitutions, key) => getFrontmatterValue(substitutions.app, substitutions.noteFilePath, key));

    this.registerFormatter('originalAttachmentFileExtension', (substitutions) => substitutions.originalAttachmentFileExtension);
    this.registerFormatter('originalAttachmentFileName', (substitutions) => substitutions.originalAttachmentFileName);

    this.registerFormatter('prompt', (substitutions) => substitutions.prompt());

    this.registerFormatter('randomDigit', () => generateRandomDigit());
    this.registerFormatter('randomDigitOrLetter', () => generateRandomDigitOrLetter());
    this.registerFormatter('randomLetter', () => generateRandomLetter());

    this.registerFormatter('uuid', () => generateUuid());

    this.registerFormatter('attachmentFileSize', (substitutions, format) => formatFileSize(substitutions.attachmentFileSizeInBytes, format));

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
      defaultValue: this.originalAttachmentFileName,
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
