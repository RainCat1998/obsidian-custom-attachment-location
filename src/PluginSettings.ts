import { EmptyAttachmentFolderBehavior } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { escapeRegExp } from 'obsidian-dev-utils/RegExp';

export const SAMPLE_CUSTOM_TOKENS = `registerCustomToken('foo', (ctx) => {
  return ctx.noteFileName + ctx.app.appId + ctx.format + ctx.obsidian.apiVersion;
});

registerCustomToken('bar', async (ctx) => {
  await sleep(100);
  return ctx.noteFileName + ctx.app.appId + ctx.format + ctx.obsidian.apiVersion;
});

registerCustomToken('baz', async (ctx) => {
  return ctx.noteFileName + await ctx.fillTemplate('corge \${grault} garply \${waldo:fred} plugh');
});
`;

const ALWAYS_MATCH_REG_EXP = /(?:)/;
const NEVER_MATCH_REG_EXP = /$./;

export enum AttachmentRenameMode {
  None = 'None',

  OnlyPastedImages = 'Only pasted images',
  // eslint-disable-next-line perfectionist/sort-enums
  All = 'All'
}

export enum CollectAttachmentUsedByMultipleNotesMode {
  Cancel = 'Cancel',
  Copy = 'Copy',
  Move = 'Move',
  Prompt = 'Prompt',
  Skip = 'Skip'
}

export class PluginSettings {
  // eslint-disable-next-line no-template-curly-in-string
  public attachmentFolderPath = './assets/${noteFileName}';
  public attachmentRenameMode: AttachmentRenameMode = AttachmentRenameMode.OnlyPastedImages;
  public collectAttachmentUsedByMultipleNotesMode: CollectAttachmentUsedByMultipleNotesMode = CollectAttachmentUsedByMultipleNotesMode.Skip;
  public duplicateNameSeparator = ' ';
  public emptyAttachmentFolderBehavior: EmptyAttachmentFolderBehavior = EmptyAttachmentFolderBehavior.DeleteWithEmptyParents;
  // eslint-disable-next-line no-template-curly-in-string
  public generatedAttachmentFileName = 'file-${date:YYYYMMDDHHmmssSSS}';
  // eslint-disable-next-line no-magic-numbers
  public jpegQuality = 0.8;
  public markdownUrlFormat = '';

  public shouldConvertPastedImagesToJpeg = false;
  public shouldDeleteOrphanAttachments = false;
  public shouldRenameAttachmentFiles = false;
  public shouldRenameAttachmentFolder = true;
  public shouldRenameCollectedAttachments = false;
  public specialCharacters = '#^[]|*\\<>:?';
  public specialCharactersReplacement = '-';
  public treatAsAttachmentExtensions: readonly string[] = ['.excalidraw.md'];
  public warningVersion = '';
  public get customTokensStr(): string {
    return this._customTokensStr;
  }

  public set customTokensStr(value: string) {
    this._customTokensStr = value;
  }

  public get excludePaths(): string[] {
    return this._excludePaths;
  }

  public set excludePaths(value: string[]) {
    this._excludePaths = value.filter(Boolean);
    this._excludePathsRegExp = makeRegExp(this._excludePaths, NEVER_MATCH_REG_EXP);
  }

  public get excludePathsFromAttachmentCollecting(): string[] {
    return this._excludePathsFromAttachmentCollecting;
  }

  public set excludePathsFromAttachmentCollecting(value: string[]) {
    this._excludePathsFromAttachmentCollecting = value.filter(Boolean);
    this._excludePathsFromAttachmentCollectingRegExp = makeRegExp(this._excludePathsFromAttachmentCollecting, NEVER_MATCH_REG_EXP);
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

  private _excludePathsFromAttachmentCollecting: string[] = [];

  private _excludePathsFromAttachmentCollectingRegExp: RegExp = NEVER_MATCH_REG_EXP;

  private _excludePathsRegExp = NEVER_MATCH_REG_EXP;

  private _includePaths: string[] = [];

  private _includePathsRegExp = ALWAYS_MATCH_REG_EXP;

  public isExcludedFromAttachmentCollecting(path: string): boolean {
    return this._excludePathsFromAttachmentCollectingRegExp.test(path);
  }

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
