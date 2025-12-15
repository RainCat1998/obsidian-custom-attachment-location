import { INFINITE_TIMEOUT } from 'obsidian-dev-utils/AbortController';
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
  // eslint-disable-next-line perfectionist/sort-enums -- Need to keep enum order.
  All = 'All'
}

export enum CollectAttachmentUsedByMultipleNotesMode {
  Cancel = 'Cancel',
  Copy = 'Copy',
  Move = 'Move',
  Prompt = 'Prompt',
  Skip = 'Skip'
}

export enum DefaultImageSizeDimension {
  Height = 'height',
  Width = 'width'
}

export class PluginSettings {
  // eslint-disable-next-line no-template-curly-in-string -- Valid token.
  public attachmentFolderPath = './assets/${noteFileName}';
  public attachmentRenameMode: AttachmentRenameMode = AttachmentRenameMode.OnlyPastedImages;
  public collectAttachmentUsedByMultipleNotesMode: CollectAttachmentUsedByMultipleNotesMode = CollectAttachmentUsedByMultipleNotesMode.Skip;
  public collectedAttachmentFileName = '';
  public defaultImageSize = '';
  public defaultImageSizeDimension: DefaultImageSizeDimension = DefaultImageSizeDimension.Width;
  public duplicateNameSeparator = ' ';
  public emptyAttachmentFolderBehavior: EmptyAttachmentFolderBehavior = EmptyAttachmentFolderBehavior.DeleteWithEmptyParents;
  // eslint-disable-next-line no-template-curly-in-string -- Valid token.
  public generatedAttachmentFileName = 'file-${date:YYYYMMDDHHmmssSSS}';
  // eslint-disable-next-line no-magic-numbers -- Magic numbers are OK in settings.
  public jpegQuality = 0.8;
  public markdownUrlFormat = '';
  public renamedAttachmentFileName = '';
  public shouldConvertPastedImagesToJpeg = false;
  public shouldDeleteOrphanAttachments = false;
  public shouldHandleRenames = true;
  public shouldRenameAttachmentFiles = false;
  public shouldRenameAttachmentFolder = true;
  public shouldRenameCollectedAttachments = false;
  public specialCharacters = '#^[]|*\\<>:?/';
  public specialCharactersReplacement = '-';
  // eslint-disable-next-line no-magic-numbers -- Magic numbers are OK in settings.
  public timeoutInSeconds = 5;
  public treatAsAttachmentExtensions: readonly string[] = ['.excalidraw.md'];
  public version = '';
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
    return new RegExp(`[${escapeRegExp(this.specialCharacters)}]+`, 'gu');
  }

  private _customTokensStr = '';

  private _excludePaths: string[] = [];

  private _excludePathsFromAttachmentCollecting: string[] = [];

  private _excludePathsFromAttachmentCollectingRegExp: RegExp = NEVER_MATCH_REG_EXP;

  private _excludePathsRegExp = NEVER_MATCH_REG_EXP;

  private _includePaths: string[] = [];

  private _includePathsRegExp = ALWAYS_MATCH_REG_EXP;

  public getTimeoutInMilliseconds(): number {
    const MILLISECONDS_PER_SECOND = 1000;
    return this.timeoutInSeconds === 0 ? INFINITE_TIMEOUT : this.timeoutInSeconds * MILLISECONDS_PER_SECOND;
  }

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
    if (path === '/') {
      return defaultRegExp.source;
    }

    if (path.startsWith('/') && path.endsWith('/')) {
      return path.slice(1, -1);
    }

    if (path.endsWith('/')) {
      return `^${escapeRegExp(path)}`;
    }

    return `^${escapeRegExp(path)}(/|$)`;
  })
    .map((regExpStr) => `(${regExpStr})`)
    .join('|');
  return new RegExp(regExpStrCombined);
}
