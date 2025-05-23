import { EmptyAttachmentFolderBehavior } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { escapeRegExp } from 'obsidian-dev-utils/RegExp';

import { Substitutions } from './Substitutions.ts';

const ALWAYS_MATCH_REG_EXP = /(?:)/;
const NEVER_MATCH_REG_EXP = /$./;

export enum AttachmentRenameMode {
  None = 'None',

  OnlyPastedImages = 'Only pasted images',
  // eslint-disable-next-line perfectionist/sort-enums
  All = 'All'
}

export class PluginSettings {
  // eslint-disable-next-line no-template-curly-in-string
  public attachmentFolderPath = './assets/${filename}';
  public attachmentRenameMode: AttachmentRenameMode = AttachmentRenameMode.OnlyPastedImages;
  public duplicateNameSeparator = ' ';
  public emptyAttachmentFolderBehavior: EmptyAttachmentFolderBehavior = EmptyAttachmentFolderBehavior.DeleteWithEmptyParents;
  // eslint-disable-next-line no-template-curly-in-string
  public generatedAttachmentFilename = 'file-${date:YYYYMMDDHHmmssSSS}';
  // eslint-disable-next-line no-magic-numbers
  public jpegQuality = 0.8;
  public markdownUrlFormat = '';
  public shouldConvertPastedImagesToJpeg = false;
  public shouldDeleteOrphanAttachments = false;
  public shouldRenameAttachmentFiles = false;
  public shouldRenameAttachmentFolder = true;
  public shouldRenameAttachmentsToLowerCase = false;
  public shouldRenameCollectedAttachments = false;
  public specialCharacters = '#^[]|*\\<>:?';
  public specialCharactersReplacement = '-';
  public treatAsAttachmentExtensions: readonly string[] = ['.excalidraw.md'];
  public warningVersion = '0.0.0';
  public get customTokensStr(): string {
    return this._customTokensStr;
  }

  public set customTokensStr(value: string) {
    this._customTokensStr = value;
    Substitutions.registerCustomFormatters(this._customTokensStr);
  }

  public get excludePaths(): string[] {
    return this._excludePaths;
  }

  public set excludePaths(value: string[]) {
    this._excludePaths = value.filter(Boolean);
    this._excludePathsRegExp = makeRegExp(this._excludePaths, NEVER_MATCH_REG_EXP);
  }

  public get includePaths(): string[] {
    return this._includePaths;
  }

  public set includePaths(value: string[]) {
    this._includePaths = value.filter(Boolean);
    this._includePathsRegExp = makeRegExp(this._includePaths, ALWAYS_MATCH_REG_EXP);
  }

  public get specialCharactersRegExp(): RegExp {
    return new RegExp(`[${escapeRegExp(this.specialCharacters)}]+`, 'g');
  }

  private _customTokensStr = '';
  private _excludePaths: string[] = [];
  private _excludePathsRegExp = NEVER_MATCH_REG_EXP;
  private _includePaths: string[] = [];

  private _includePathsRegExp = ALWAYS_MATCH_REG_EXP;

  public isPathIgnored(path: string): boolean {
    return !this._includePathsRegExp.test(path) || this._excludePathsRegExp.test(path);
  }
}

function makeRegExp(paths: string[], defaultRegExp: RegExp): RegExp {
  if (paths.length === 0) {
    return defaultRegExp;
  }

  const regExpStrCombined = paths.map((path) => {
    if (path.startsWith('/') && path.endsWith('/')) {
      return path.slice(1, -1);
    }
    return `^${escapeRegExp(path)}`;
  })
    .map((regExpStr) => `(${regExpStr})`)
    .join('|');
  return new RegExp(regExpStrCombined);
}
