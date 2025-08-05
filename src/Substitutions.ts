import type {
  App,
  TFile
} from 'obsidian';
import type { Promisable } from 'type-fest';

import moment from 'moment';
import { getNestedPropertyValue } from 'obsidian-dev-utils/ObjectUtils';
import { getFileOrNull } from 'obsidian-dev-utils/obsidian/FileSystem';
import { getCacheSafe } from 'obsidian-dev-utils/obsidian/MetadataCache';
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
// eslint-disable-next-line import-x/no-rename-default
import slugify_ from 'slugify';

const slugify = ('default' in slugify_ ? slugify_.default : slugify_) as unknown as typeof slugify_.default;

type Formatter = (substitutions: Substitutions, format: string) => Promisable<unknown>;
interface FormatWithParameter {
  base: string;
  parameter: number | undefined;
}

const HEADING_LEVELS = ['1', '2', '3', '4', '5', '6', 'any'] as const;
type HeadingLevel = (typeof HEADING_LEVELS)[number];

const MORE_THAN_TWO_DOTS_REG_EXP = /^\.{3,}$/;
const TRAILING_DOTS_AND_SPACES_REG_EXP = /[. ]+$/;
export const INVALID_FILENAME_PATH_CHARS_REG_EXP = /[\\/:*?"<>|]/;
export const SUBSTITUTION_TOKEN_REG_EXP = /\${(?<Token>.+?)(?::(?<Format>.+?))?}/g;

interface SubstitutionsContract {
  app: App;
  fillTemplate(template: string): Promise<string>;
  generatedAttachmentFileName: string;
  generatedAttachmentFilePath: string;
  noteFileName: string;
  noteFilePath: string;
  noteFolderName: string;
  noteFolderPath: string;
  originalAttachmentFileExtension: string;
  originalAttachmentFileName: string;
}

interface SubstitutionsOptions {
  app: App;
  attachmentFileSizeInBytes?: number;
  generatedAttachmentFileName?: string;
  generatedAttachmentFilePath?: string;
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

function formatFileName(fileName: string, format: string): string {
  const { base, parameter } = parseFormatWithParameter(format);

  switch (base) {
    case '':
      return fileName;
    case 'left':
      return fileName.slice(0, parameter ?? 1);
    case 'lower':
      return fileName.toLowerCase();
    case 'right':
      return fileName.slice(-(parameter ?? 1));
    case 'slug':
      return slugifyEx(fileName);
    case 'upper':
      return fileName.toUpperCase();
    default:
      throw new Error(`Invalid file name format: ${format}`);
  }
}

function formatFileSize(sizeInBytes: number, format: string): string {
  const BYTES_IN_KB = 1024;
  const BYTES_IN_MB = BYTES_IN_KB * BYTES_IN_KB;

  const { base, parameter } = parseFormatWithParameter(format);

  switch (base) {
    case '':
    case 'B':
      return sizeInBytes.toFixed(parameter ?? 0);
    case 'KB':
      return (sizeInBytes / BYTES_IN_KB).toFixed(parameter ?? 0);
    case 'MB':
      return (sizeInBytes / BYTES_IN_MB).toFixed(parameter ?? 0);
    default:
      throw new Error(`Invalid file size format: ${format}`);
  }
}

function formatFolderName(folderPath: string, format: string): string {
  const folderParts = folderPath.split('/');
  let folderPartIndex = folderParts.length - 1;

  let commaIndex = format.indexOf(',');
  const NOT_FOUND_INDEX = -1;
  if (commaIndex === NOT_FOUND_INDEX) {
    commaIndex = format.length;
  }
  const format1 = format.slice(0, commaIndex);
  const format2 = format.slice(commaIndex + 1);

  const format1WithParameter = parseFormatWithParameter(format1);
  switch (format1WithParameter.base) {
    case 'indexFromEnd':
      folderPartIndex = folderParts.length - 1 - (format1WithParameter.parameter ?? 0);
      break;
    case 'indexFromStart':
      folderPartIndex = format1WithParameter.parameter ?? 0;
      break;
    default:
      if (format2) {
        throw new Error(`Invalid format: ${format1}`);
      }
      return formatFileName(folderParts[folderPartIndex] ?? '', format1);
  }

  const folderName = folderParts[folderPartIndex] ?? '';
  return formatFileName(folderName, format2);
}

function generateRandomValue(format: string): string {
  if (format === 'uuid') {
    return crypto.randomUUID();
  }

  const { base, parameter } = parseFormatWithParameter(format);

  let symbols: string;

  switch (base) {
    case 'D':
      symbols = '0123456789';
      break;
    case 'DL':
      symbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;
    case 'L':
      symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;
    default:
      throw new Error(`Invalid random value format: ${format}`);
  }

  let ans = '';

  for (let i = 0; i < (parameter ?? 1); i++) {
    ans += generateRandomSymbol(symbols);
  }

  return ans;
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

export class Substitutions implements SubstitutionsContract {
  private static readonly formatters = new Map<string, Formatter>();
  static {
    this.registerCustomFormatters('');
  }

  public readonly app: App;

  public readonly generatedAttachmentFileName: string;
  public readonly generatedAttachmentFilePath: string;
  public readonly noteFileName: string;
  public readonly noteFilePath: string;
  public readonly noteFolderName: string;
  public readonly noteFolderPath: string;
  public readonly originalAttachmentFileExtension: string;
  public readonly originalAttachmentFileName: string;
  private attachmentFileSizeInBytes: number;
  private readonly cursorLine: null | number;
  private headingsInfo: Map<HeadingLevel, string> | null = null;

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

    this.generatedAttachmentFileName = options.generatedAttachmentFileName ?? '';
    this.generatedAttachmentFilePath = options.generatedAttachmentFilePath ?? '';

    this.cursorLine = null;

    if (this.app.workspace.activeEditor?.file?.path === this.noteFilePath) {
      const cursor = this.app.workspace.activeEditor.editor?.getCursor();
      if (cursor) {
        this.cursorLine = cursor.line;
      }
    }
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

    this.registerFormatter('noteFileName', (substitutions, format) => formatFileName(substitutions.noteFileName, format));
    this.registerFormatter('noteFilePath', (substitutions) => substitutions.noteFilePath);
    this.registerFormatter('noteFolderName', (substitutions, format) => formatFolderName(substitutions.noteFolderPath, format));
    this.registerFormatter('noteFolderPath', (substitutions) => substitutions.noteFolderPath);

    this.registerFormatter('frontmatter', (substitutions, key) => getFrontmatterValue(substitutions.app, substitutions.noteFilePath, key));

    this.registerFormatter('originalAttachmentFileExtension', (substitutions) => substitutions.originalAttachmentFileExtension);
    this.registerFormatter('originalAttachmentFileName', (substitutions, format) => formatFileName(substitutions.originalAttachmentFileName, format));

    this.registerFormatter('prompt', (substitutions) => substitutions.prompt());

    this.registerFormatter('random', (_substitutions, format) => generateRandomValue(format));

    this.registerFormatter('attachmentFileSize', (substitutions, format) => formatFileSize(substitutions.attachmentFileSizeInBytes, format));

    this.registerFormatter('generatedAttachmentFileName', (substitutions, format) => formatFileName(substitutions.generatedAttachmentFileName, format));
    this.registerFormatter('generatedAttachmentFilePath', (substitutions) => substitutions.generatedAttachmentFilePath);

    this.registerFormatter('heading', async (substitutions, format) => substitutions.getHeading(format));

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

  private async getHeading(format: string): Promise<string> {
    if (!(HEADING_LEVELS as readonly string[]).includes(format)) {
      throw new Error(`Invalid heading level: ${format}`);
    }

    const headingsInfo = await this.initHeadings();
    return headingsInfo.get(format as HeadingLevel) ?? '';
  }

  private async initHeadings(): Promise<Map<HeadingLevel, string>> {
    if (this.headingsInfo) {
      return this.headingsInfo;
    }

    this.headingsInfo = new Map<HeadingLevel, string>();

    if (!this.cursorLine) {
      return this.headingsInfo;
    }

    const cache = await getCacheSafe(this.app, this.noteFilePath);
    if (!cache?.headings) {
      return this.headingsInfo;
    }

    const lastLines = new Map<HeadingLevel, number>();

    for (const heading of cache.headings) {
      if (heading.position.start.line > this.cursorLine) {
        continue;
      }

      const headingLevel = String(heading.level) as HeadingLevel;

      const lastLine = lastLines.get(headingLevel) ?? -1;
      if (heading.position.start.line > lastLine) {
        this.headingsInfo.set(headingLevel, heading.heading);
        lastLines.set(headingLevel, heading.position.start.line);
        if (heading.position.start.line > (lastLines.get('any') ?? -1)) {
          lastLines.set('any', heading.position.start.line);
          this.headingsInfo.set('any', heading.heading);
        }
      }
    }

    return this.headingsInfo;
  }

  private async prompt(): Promise<string> {
    const promptResult = await prompt({
      app: this.app,
      defaultValue: this.originalAttachmentFileName,
      // eslint-disable-next-line no-template-curly-in-string
      title: 'Provide a value for ${prompt} template',
      valueValidator: (value) => validateFileName(this.app, value, false)
    });
    if (promptResult === null) {
      throw new Error('Prompt cancelled');
    }
    return promptResult;
  }
}

export async function validateFileName(app: App, fileName: string, areTokensAllowed = true): Promise<string> {
  if (areTokensAllowed) {
    const validationMessage = await validateTokens(app, fileName);
    if (validationMessage) {
      return validationMessage;
    }
  } else {
    const match = fileName.match(SUBSTITUTION_TOKEN_REG_EXP);
    if (match) {
      return 'Tokens are not allowed in file name';
    }
  }

  fileName = removeTokenFormatting(fileName);

  if (fileName === '.' || fileName === '..') {
    return '';
  }

  if (!fileName) {
    return 'File name is empty';
  }

  if (INVALID_FILENAME_PATH_CHARS_REG_EXP.test(fileName)) {
    return `File name "${fileName}" contains invalid symbols`;
  }

  if (MORE_THAN_TWO_DOTS_REG_EXP.test(fileName)) {
    return `File name "${fileName}" contains more than two dots`;
  }

  if (TRAILING_DOTS_AND_SPACES_REG_EXP.test(fileName)) {
    return `File name "${fileName}" contains trailing dots or spaces`;
  }

  return '';
}

export async function validatePath(app: App, path: string, areTokensAllowed = true): Promise<string> {
  if (areTokensAllowed) {
    const unknownToken = await validateTokens(app, path);
    if (unknownToken) {
      return `Unknown token: ${unknownToken}`;
    }
  } else {
    const match = path.match(SUBSTITUTION_TOKEN_REG_EXP);
    if (match) {
      return 'Tokens are not allowed in path';
    }
  }

  path = removeTokenFormatting(path);

  path = trimStart(path, '/');
  path = trimEnd(path, '/');

  if (path === '') {
    return '';
  }

  const parts = path.split('/');
  for (const part of parts) {
    const partValidationError = await validateFileName(app, part);

    if (partValidationError) {
      return partValidationError;
    }
  }

  return '';
}

function generateRandomSymbol(symbols: string): string {
  return symbols[Math.floor(Math.random() * symbols.length)] ?? '';
}

function parseFormatWithParameter(format: string): FormatWithParameter {
  const match = /^(?<Base>\w*?)(?<Parameter>\d*)$/.exec(format);
  if (!match) {
    throw new Error(`Invalid format: ${format}`);
  }

  const base = match.groups?.['Base'] ?? '';
  const parameterStr = match.groups?.['Parameter'];
  const parameter = parameterStr ? parseInt(parameterStr, 10) : undefined;

  return {
    base,
    parameter
  };
}

function removeTokenFormatting(str: string): string {
  return replaceAll(str, SUBSTITUTION_TOKEN_REG_EXP, (_, token) => `\${${token}}`);
}

function slugifyEx(str: string): string {
  return slugify(str, {
    lower: true
  });
}

async function validateTokens(app: App, str: string): Promise<null | string> {
  const FAKE_SUBSTITUTION = new Substitutions({
    app,
    noteFilePath: ''
  });

  const matches = str.matchAll(SUBSTITUTION_TOKEN_REG_EXP);
  for (const match of matches) {
    const token = match.groups?.['Token'] ?? '';
    if (!Substitutions.isRegisteredToken(token)) {
      return `Unknown token: ${token}`;
    }
    const format = match.groups?.['Format'] ?? '';
    if (format) {
      const singleFormats = format.split(',');
      for (const singleFormat of singleFormats) {
        try {
          await FAKE_SUBSTITUTION.fillTemplate(`\${${token}:${singleFormat}}`);
        } catch {
          return `Token ${token} is used with unknown format: ${singleFormat}`;
        }
      }
    }
  }
  return null;
}
