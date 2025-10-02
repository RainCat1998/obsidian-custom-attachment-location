import type {
  App,
  FileStats,
  TFile
} from 'obsidian';
import type { Promisable } from 'type-fest';

import moment from 'moment';
// eslint-disable-next-line import-x/no-namespace -- Need to pass entire obsidian module.
import * as obsidian from 'obsidian';
import { printError } from 'obsidian-dev-utils/Error';
import {
  extractDefaultExportInterop,
  getNestedPropertyValue
} from 'obsidian-dev-utils/ObjectUtils';
import { DUMMY_PATH } from 'obsidian-dev-utils/obsidian/AttachmentPath';
import { getFileOrNull } from 'obsidian-dev-utils/obsidian/FileSystem';
import { getCacheSafe } from 'obsidian-dev-utils/obsidian/MetadataCache';
import { getOsUnsafePathCharsRegExp } from 'obsidian-dev-utils/obsidian/Validation';
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
// eslint-disable-next-line import-x/no-rename-default -- Need to rename default export.
import slugify_ from 'slugify';

import type { Plugin } from './Plugin.ts';
import type { TokenEvaluatorContext } from './TokenEvaluatorContext.ts';

import { promptWithPreview } from './PromptWithPreviewModal.ts';
import { ActionContext } from './TokenEvaluatorContext.ts';

const slugify = extractDefaultExportInterop(slugify_);

interface FormatWithParameter {
  base: string;
  parameter: number | undefined;
}

interface Token {
  format: string;
  token: string;
}

type TokenEvaluator = (ctx: TokenEvaluatorContext, substitutions: Substitutions) => Promisable<string>;

const HEADING_LEVELS = ['1', '2', '3', '4', '5', '6', 'any'] as const;
type HeadingLevel = (typeof HEADING_LEVELS)[number];

const MORE_THAN_TWO_DOTS_REG_EXP = /^\.{3,}$/;
const TRAILING_DOTS_REG_EXP = /\.+$/;
const SUBSTITUTION_TOKEN_REG_EXP = /\${(?<Token>.+?)(?::(?<Format>.*?))?}/g;

export enum TokenValidationMode {
  Error = 'Error',
  Skip = 'Skip',
  Validate = 'Validate'
}

type RegisterCustomTokenFn = (token: string, evaluator: TokenEvaluator) => void;

type RegisterCustomTokensWrapperFn = (registerCustomToken: RegisterCustomTokenFn) => void;

interface SubstitutionsOptions {
  actionContext: ActionContext;
  attachmentFileContent?: ArrayBuffer | undefined;
  attachmentFileStat?: FileStats | undefined;
  cursorLine?: number | undefined;
  generatedAttachmentFileName?: string;
  generatedAttachmentFilePath?: string;
  noteFilePath: string;
  oldNoteFilePath?: string | undefined;
  originalAttachmentFileName?: string;
  plugin: Plugin;
}

interface ValidateFileNameOptions {
  areSingleDotsAllowed: boolean;
  fileName: string;
  isEmptyAllowed: boolean;
  plugin: Plugin;
  tokenValidationMode: TokenValidationMode;
}
interface ValidatePathOptions {
  areTokensAllowed: boolean;
  path: string;
  plugin: Plugin;
}

export function parseCustomTokens(customTokensStr: string): Map<string, TokenEvaluator> | null {
  const evaluators = new Map<string, TokenEvaluator>();
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func -- Need to create function from string.
    const registerCustomTokensWrapperFn = new Function('registerCustomToken', customTokensStr) as RegisterCustomTokensWrapperFn;

    registerCustomTokensWrapperFn(registerCustomToken);
    return evaluators;
  } catch (e) {
    printError(new Error('Error registering custom tokens', { cause: e }));
    return null;
  }

  function registerCustomToken(token: string, evaluator: TokenEvaluator): void {
    evaluators.set(token, evaluator);
  }
}

function formatAttachmentFileDate(timestamp: number | undefined, format: string): string {
  const DEFAULT_NOW_SUFFIX = ',default=now';
  const DEFAULT_EMPTY_SUFFIX = ',default=empty';
  let defaultBehavior: 'empty' | 'now' = 'empty';

  if (format.endsWith(DEFAULT_NOW_SUFFIX)) {
    format = trimEnd(format, DEFAULT_NOW_SUFFIX);
    defaultBehavior = 'now';
  } else if (format.endsWith(DEFAULT_EMPTY_SUFFIX)) {
    format = trimEnd(format, DEFAULT_EMPTY_SUFFIX);
    defaultBehavior = 'empty';
  }

  if (timestamp) {
    return moment(timestamp).format(format);
  }

  if (defaultBehavior === 'now') {
    return moment().format(format);
  }

  return '';
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
      return formatString(folderParts[folderPartIndex] ?? '', format1);
  }

  const folderName = folderParts[folderPartIndex] ?? '';
  return formatString(folderName, format2);
}

function formatString(str: string, format: string): string {
  const { base, parameter } = parseFormatWithParameter(format);

  switch (base) {
    case '':
      return str;
    case 'left':
      return str.slice(0, parameter ?? 1);
    case 'lower':
      return str.toLowerCase();
    case 'right':
      return str.slice(-(parameter ?? 1));
    case 'slug':
      return slugifyEx(str);
    case 'upper':
      return str.toUpperCase();
    default:
      throw new Error(`Invalid file name format: ${format}`);
  }
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
  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- Need to convert to string.
  return String(value);
}

export class Substitutions {
  private static readonly evaluators = new Map<string, TokenEvaluator>();
  static {
    this.registerCustomTokens('');
  }

  public readonly noteFolderPath: string;

  private readonly actionContext: ActionContext;
  private readonly app: App;
  private readonly attachmentFileContent: ArrayBuffer | undefined;
  private readonly attachmentFileStat: FileStats | undefined;
  private readonly cursorLine: null | number;
  private readonly generatedAttachmentFileName: string;
  private readonly generatedAttachmentFilePath: string;
  private headingsInfo: Map<HeadingLevel, string> | null = null;
  private readonly noteFileName: string;
  private readonly noteFilePath: string;
  private readonly noteFolderName: string;
  private readonly oldNoteFileName: string;
  private readonly oldNoteFilePath: string;
  private readonly oldNoteFolderName: string;
  private readonly oldNoteFolderPath: string;
  private readonly originalAttachmentFileExtension: string;
  private readonly originalAttachmentFileName: string;
  private readonly plugin: Plugin;

  public constructor(options: SubstitutionsOptions) {
    this.plugin = options.plugin;
    this.app = options.plugin.app;
    this.actionContext = options.actionContext;

    this.noteFilePath = options.noteFilePath;
    this.noteFileName = basename(this.noteFilePath, extname(this.noteFilePath));
    this.noteFolderName = basename(dirname(this.noteFilePath));
    this.noteFolderPath = dirname(this.noteFilePath);

    this.oldNoteFilePath = options.oldNoteFilePath ?? '';
    this.oldNoteFileName = basename(this.oldNoteFilePath, extname(this.oldNoteFilePath));
    this.oldNoteFolderName = basename(dirname(this.oldNoteFilePath));
    this.oldNoteFolderPath = dirname(this.oldNoteFilePath);

    const originalAttachmentFileName = options.originalAttachmentFileName ?? '';
    const originalAttachmentFileExtension = extname(originalAttachmentFileName);
    this.originalAttachmentFileName = basename(originalAttachmentFileName, originalAttachmentFileExtension);
    this.originalAttachmentFileExtension = originalAttachmentFileExtension.slice(1);

    this.attachmentFileContent = options.attachmentFileContent;
    this.attachmentFileStat = options.attachmentFileStat;

    this.generatedAttachmentFileName = options.generatedAttachmentFileName ?? '';
    this.generatedAttachmentFilePath = options.generatedAttachmentFilePath ?? '';

    if (options.cursorLine === undefined) {
      this.cursorLine = null;

      if (this.app.workspace.activeEditor?.file?.path === this.noteFilePath) {
        const cursor = this.app.workspace.activeEditor.editor?.getCursor();
        if (cursor) {
          this.cursorLine = cursor.line;
        }
      }
    } else {
      this.cursorLine = options.cursorLine;
    }
  }

  public static isRegisteredToken(token: string): boolean {
    return Substitutions.evaluators.has(token.toLowerCase());
  }

  public static registerCustomTokens(customTokensStr: string): void {
    this.evaluators.clear();
    this.registerToken('date', (ctx) => formatDate(ctx.format));
    this.registerToken(
      'noteFileCreationDate',
      (ctx) => formatFileDate(ctx.app, ctx.noteFilePath, ctx.format, (file) => file.stat.ctime)
    );
    this.registerToken(
      'noteFileModificationDate',
      (ctx) => formatFileDate(ctx.app, ctx.noteFilePath, ctx.format, (file) => file.stat.mtime)
    );
    this.registerToken(
      'originalAttachmentFileCreationDate',
      (ctx) => formatAttachmentFileDate(ctx.attachmentFileStat?.ctime, ctx.format)
    );
    this.registerToken(
      'originalAttachmentFileModificationDate',
      (ctx) => formatAttachmentFileDate(ctx.attachmentFileStat?.mtime, ctx.format)
    );

    this.registerToken('noteFileName', (ctx) => formatString(ctx.noteFileName, ctx.format));
    this.registerToken('noteFilePath', (ctx) => ctx.noteFilePath);
    this.registerToken('noteFolderName', (ctx) => formatFolderName(ctx.noteFolderPath, ctx.format));
    this.registerToken('noteFolderPath', (ctx) => ctx.noteFolderPath);

    this.registerToken('frontmatter', (ctx) => getFrontmatterValue(ctx.app, ctx.noteFilePath, ctx.format));

    this.registerToken('originalAttachmentFileExtension', (ctx) => ctx.originalAttachmentFileExtension);
    this.registerToken('originalAttachmentFileName', (ctx) => formatString(ctx.originalAttachmentFileName, ctx.format));

    this.registerToken('prompt', (ctx, substitutions) => substitutions.prompt(ctx));

    this.registerToken('random', (ctx) => generateRandomValue(ctx.format));

    this.registerToken('attachmentFileSize', (ctx) => formatFileSize(ctx.attachmentFileContent?.byteLength ?? 0, ctx.format));

    this.registerToken('generatedAttachmentFileName', (ctx) => formatString(ctx.generatedAttachmentFileName, ctx.format));
    this.registerToken('generatedAttachmentFilePath', (ctx) => ctx.generatedAttachmentFilePath);

    this.registerToken('heading', async (ctx, substitutions) => substitutions.getHeading(ctx.format));

    const customTokens = parseCustomTokens(customTokensStr) ?? new Map<string, TokenEvaluator>();
    for (const [token, evaluator] of customTokens.entries()) {
      this.registerToken(token, evaluator);
    }
  }

  private static registerToken(token: string, evaluator: TokenEvaluator): void {
    this.evaluators.set(token.toLowerCase(), evaluator);
  }

  public async fillTemplate(template: string): Promise<string> {
    return await replaceAllAsync(template, SUBSTITUTION_TOKEN_REG_EXP, async (abortSignal, args, token, format) => {
      abortSignal.throwIfAborted();

      const evaluator = Substitutions.evaluators.get(token.toLowerCase());
      if (!evaluator) {
        throw new Error(`Unknown token '${token}'.`);
      }

      const ctx: TokenEvaluatorContext = {
        abortSignal,
        actionContext: this.actionContext,
        app: this.app,
        attachmentFileContent: this.attachmentFileContent,
        attachmentFileStat: this.attachmentFileStat,
        fillTemplate: this.fillTemplate.bind(this),
        format,
        fullTemplate: template,
        generatedAttachmentFileName: this.generatedAttachmentFileName,
        generatedAttachmentFilePath: this.generatedAttachmentFilePath,
        noteFileName: this.noteFileName,
        noteFilePath: this.noteFilePath,
        noteFolderName: this.noteFolderName,
        noteFolderPath: this.noteFolderPath,
        obsidian,
        oldNoteFileName: this.oldNoteFileName,
        oldNoteFilePath: this.oldNoteFilePath,
        oldNoteFolderName: this.oldNoteFolderName,
        oldNoteFolderPath: this.oldNoteFolderPath,
        originalAttachmentFileExtension: this.originalAttachmentFileExtension,
        originalAttachmentFileName: this.originalAttachmentFileName,
        token,
        tokenEndOffset: args.offset + args.substring.length,
        tokenStartOffset: args.offset,
        tokenWithFormat: args.substring
      };

      try {
        const result = await evaluator(ctx, this);
        abortSignal.throwIfAborted();

        if (typeof result !== 'string') {
          console.error('Token returned non-string value.', {
            ctx,
            result
          });
          throw new Error('Token returned non-string value');
        }
        return result;
      } catch (e) {
        throw new Error(`Error formatting token \${${token}}`, { cause: e });
      }
    });
  }

  public async prompt(ctx: TokenEvaluatorContext): Promise<string> {
    // Validate format
    formatString('', ctx.format);

    if (ctx.actionContext === ActionContext.ValidateTokens || ctx.originalAttachmentFileName === DUMMY_PATH) {
      return DUMMY_PATH;
    }

    const promptResult = await promptWithPreview({
      ctx,
      valueValidator: (value) =>
        validatePath({
          areTokensAllowed: false,
          path: value,
          plugin: this.plugin
        })
    });
    if (promptResult === null) {
      throw new Error('Prompt cancelled');
    }
    return formatString(promptResult, ctx.format);
  }

  private async getHeading(format: string): Promise<string> {
    format ||= 'any';
    if (!(HEADING_LEVELS as readonly string[]).includes(format)) {
      throw new Error(`Invalid heading level: ${format}`);
    }

    const headingsInfo = await this.initHeadings();
    const rawHeading = headingsInfo.get(format as HeadingLevel) ?? '';
    return this.plugin.replaceSpecialCharacters(rawHeading);
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
}

export function hasPromptToken(str: string): boolean {
  return extractTokens(str).some((token) => token.token === 'prompt');
}

export async function validateFileName(options: ValidateFileNameOptions): Promise<string> {
  switch (options.tokenValidationMode) {
    case TokenValidationMode.Error: {
      const match = options.fileName.match(SUBSTITUTION_TOKEN_REG_EXP);
      if (match) {
        return 'Tokens are not allowed in file name';
      }
      break;
    }
    case TokenValidationMode.Skip:
      break;
    case TokenValidationMode.Validate: {
      const validationMessage = await validateTokens(options.plugin, options.fileName);
      if (validationMessage) {
        return validationMessage;
      }
      break;
    }
    default:
      throw new Error(`Invalid token validation mode: ${options.tokenValidationMode as string}`);
  }

  const cleanFileName = removeTokens(options.fileName);

  if (cleanFileName === '.' || cleanFileName === '..') {
    return options.areSingleDotsAllowed ? '' : 'Single dots are not allowed in file name';
  }

  if (!cleanFileName) {
    return options.isEmptyAllowed ? '' : 'File name is empty';
  }

  if (getOsUnsafePathCharsRegExp().test(cleanFileName)) {
    return `File name "${options.fileName}" contains invalid symbols`;
  }

  if (MORE_THAN_TWO_DOTS_REG_EXP.test(cleanFileName)) {
    return `File name "${options.fileName}" contains more than two dots`;
  }

  if (TRAILING_DOTS_REG_EXP.test(cleanFileName)) {
    return `File name "${options.fileName}" contains trailing dots`;
  }

  return '';
}

export async function validatePath(options: ValidatePathOptions): Promise<string> {
  if (options.areTokensAllowed) {
    const unknownToken = await validateTokens(options.plugin, options.path);
    if (unknownToken) {
      return `Unknown token: ${unknownToken}`;
    }
  } else {
    const match = options.path.match(SUBSTITUTION_TOKEN_REG_EXP);
    if (match) {
      return 'Tokens are not allowed in path';
    }
  }

  let path = trimStart(options.path, '/');
  path = trimEnd(path, '/');

  if (path === '') {
    return '';
  }

  const pathParts = path.split('/');
  for (const part of pathParts) {
    const partValidationError = await validateFileName({
      areSingleDotsAllowed: true,
      fileName: part,
      isEmptyAllowed: true,
      plugin: options.plugin,
      tokenValidationMode: TokenValidationMode.Skip
    });

    if (partValidationError) {
      return partValidationError;
    }
  }

  return '';
}

function extractTokens(str: string): Token[] {
  const matches = str.matchAll(SUBSTITUTION_TOKEN_REG_EXP);
  return Array.from(matches).map((match) => ({
    format: match.groups?.['Format'] ?? '',
    token: match.groups?.['Token'] ?? ''
  }));
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

function removeTokens(str: string): string {
  return replaceAll(str, SUBSTITUTION_TOKEN_REG_EXP, (_, token, format) => `_${token}_${format}_`);
}

function slugifyEx(str: string): string {
  return slugify(str, {
    lower: true
  });
}

async function validateTokens(plugin: Plugin, str: string): Promise<null | string> {
  const FAKE_SUBSTITUTION = new Substitutions({
    actionContext: ActionContext.ValidateTokens,
    noteFilePath: DUMMY_PATH,
    originalAttachmentFileName: DUMMY_PATH,
    plugin
  });

  const tokens = extractTokens(str);
  for (const token of tokens) {
    if (!Substitutions.isRegisteredToken(token.token)) {
      return `Unknown token '${token.token}'.`;
    }
    const singleFormats = token.format.split(',');
    for (const singleFormat of singleFormats) {
      try {
        await FAKE_SUBSTITUTION.fillTemplate(`\${${token.token}:${singleFormat}}`);
      } catch {
        return `Token '${token.token}' is used with unknown format '${singleFormat}'.`;
      }
    }
  }
  return null;
}
