import type { MaybeReturn } from 'obsidian-dev-utils/Type';

import { debounce } from 'obsidian';
import { invokeAsyncSafely } from 'obsidian-dev-utils/Async';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { alert } from 'obsidian-dev-utils/obsidian/Modals/Alert';
import { PluginSettingsManagerBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsManagerBase';
import { EmptyAttachmentFolderBehavior } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { getOsUnsafePathCharsRegExp } from 'obsidian-dev-utils/obsidian/Validation';
import { isValidRegExp } from 'obsidian-dev-utils/RegExp';
import { replaceAll } from 'obsidian-dev-utils/String';
import { compare } from 'semver';

import type { PluginTypes } from './PluginTypes.ts';

import {
  CollectAttachmentUsedByMultipleNotesMode,
  PluginSettings
} from './PluginSettings.ts';
import {
  parseCustomTokens,
  TokenValidationMode,
  validateFileName,
  validatePath
} from './Substitutions.ts';

const CUSTOM_TOKENS_VALIDATOR_DEBOUNCE_IN_MILLISECONDS = 2000;

class LegacySettings {
  public autoRenameFiles = false;
  public autoRenameFolder = true;
  public convertImagesOnDragAndDrop = false;
  public convertImagesToJpeg = false;
  public dateTimeFormat = '';
  public deleteOrphanAttachments = false;
  public generatedAttachmentFilename = '';
  public keepEmptyAttachmentFolders = false;
  // eslint-disable-next-line no-template-curly-in-string
  public pastedFileName = 'file-${date:YYYYMMDDHHmmssSSS}';
  public pastedImageFileName = '';
  public renameAttachmentsOnDragAndDrop = false;
  public renameCollectedFiles = false;
  public renameOnlyImages = false;
  public renamePastedFilesWithKnownNames = false;
  public replaceWhitespace = false;
  public shouldDuplicateCollectedAttachments = false;
  public shouldKeepEmptyAttachmentFolders = false;
  public shouldRenameAttachmentFolder = true;
  public shouldRenameAttachmentsToLowerCase = false;
  public toLowerCase = false;
  public whitespaceReplacement = '';
}

export class PluginSettingsManager extends PluginSettingsManagerBase<PluginTypes> {
  public shouldDebounceCustomTokensValidation = false;
  private customTokensValidatorDebounced = debounce(this.customTokensValidatorImpl.bind(this), CUSTOM_TOKENS_VALIDATOR_DEBOUNCE_IN_MILLISECONDS);
  private lastCustomTokenValidatorResult: string | undefined = undefined;

  protected override createDefaultSettings(): PluginSettings {
    return new PluginSettings();
  }

  protected override registerLegacySettingsConverters(): void {
    // eslint-disable-next-line complexity
    this.registerLegacySettingsConverter(LegacySettings, (legacySettings) => {
      const dateTimeFormat = legacySettings.dateTimeFormat ?? 'YYYYMMDDHHmmssSSS';
      legacySettings.attachmentFolderPath = addDateTimeFormat(legacySettings.attachmentFolderPath ?? '', dateTimeFormat);

      legacySettings.generatedAttachmentFileName = addDateTimeFormat(
        legacySettings.generatedAttachmentFileName
          ?? legacySettings.generatedAttachmentFilename
          ?? legacySettings.pastedFileName
          ?? legacySettings.pastedImageFileName
          // eslint-disable-next-line no-template-curly-in-string
          ?? 'file-${date}',
        dateTimeFormat
      );
      if (legacySettings.replaceWhitespace !== undefined) {
        legacySettings.whitespaceReplacement = legacySettings.replaceWhitespace ? '-' : '';
      }

      if (legacySettings.autoRenameFiles !== undefined) {
        legacySettings.shouldRenameAttachments = legacySettings.autoRenameFiles;
      }

      if (legacySettings.shouldRenameAttachmentFolder !== undefined) {
        legacySettings.shouldRenameAttachments = legacySettings.shouldRenameAttachmentFolder;
      }

      if (legacySettings.autoRenameFolder !== undefined) {
        legacySettings.shouldRenameAttachments = legacySettings.autoRenameFolder;
      }

      if (legacySettings.deleteOrphanAttachments !== undefined) {
        legacySettings.shouldDeleteOrphanAttachments = legacySettings.deleteOrphanAttachments;
      }

      if (legacySettings.keepEmptyAttachmentFolders !== undefined) {
        legacySettings.shouldKeepEmptyAttachmentFolders = legacySettings.keepEmptyAttachmentFolders;
      }

      if (legacySettings.renameCollectedFiles !== undefined) {
        legacySettings.shouldRenameCollectedAttachments = legacySettings.renameCollectedFiles;
      }

      if (legacySettings.toLowerCase || legacySettings.shouldRenameAttachmentsToLowerCase) {
        invokeAsyncSafely(async () => {
          await this.plugin.waitForLifecycleEvent('layoutReady');
          await alert({
            app: this.app,
            message: createFragment((f) => {
              f.appendText('In plugin version 9.0.0, the "Rename attachments to lower case" setting is deprecated. Use ');
              appendCodeBlock(f, 'lower');
              f.appendText(' format instead. See ');
              f.createEl('a', {
                href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
                text: 'documentation.'
              });
              f.appendText(' for more information.');
            })
          });
        });
      }

      if (legacySettings.customTokensStr && legacySettings.warningVersion && compare(legacySettings.warningVersion, '9.0.0') < 0) {
        legacySettings.customTokensStr = `// Custom tokens were commented out as they have to be updated to the new format introduced in plugin version 9.0.0.
// Refer to the documentation (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) for more information.

${commentOut(legacySettings.customTokensStr)}
`;
        invokeAsyncSafely(async () => {
          await this.plugin.waitForLifecycleEvent('layoutReady');
          await alert({
            app: this.app,
            message: createFragment((f) => {
              f.appendText('In plugin version 9.0.0, the format of custom token registration changed. Please update your tokens accordingly. Refer to the ');
              f.createEl('a', {
                href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens',
                text: 'documentation'
              });
              f.appendText(' for more information.');
            })
          });
        });
      }

      if (legacySettings.convertImagesToJpeg !== undefined) {
        legacySettings.shouldConvertPastedImagesToJpeg = legacySettings.convertImagesToJpeg;
      }

      if (legacySettings.whitespaceReplacement) {
        legacySettings.specialCharacters = `${legacySettings.specialCharacters ?? ''} `;
        legacySettings.specialCharactersReplacement = legacySettings.whitespaceReplacement;
      }

      if (legacySettings.shouldKeepEmptyAttachmentFolders !== undefined) {
        legacySettings.emptyAttachmentFolderBehavior = legacySettings.shouldKeepEmptyAttachmentFolders
          ? EmptyAttachmentFolderBehavior.Keep
          : EmptyAttachmentFolderBehavior.DeleteWithEmptyParents;
      }

      legacySettings.attachmentFolderPath = this.replaceLegacyTokens(legacySettings.attachmentFolderPath);
      legacySettings.generatedAttachmentFileName = this.replaceLegacyTokens(legacySettings.generatedAttachmentFileName);
      legacySettings.markdownUrlFormat = this.replaceLegacyTokens(legacySettings.markdownUrlFormat);
      legacySettings.customTokensStr = this.replaceLegacyTokens(legacySettings.customTokensStr ?? '');

      if (legacySettings.collectAttachmentUsedByMultipleNotesMode === undefined && legacySettings.shouldDuplicateCollectedAttachments !== undefined) {
        legacySettings.collectAttachmentUsedByMultipleNotesMode = legacySettings.shouldDuplicateCollectedAttachments
          ? CollectAttachmentUsedByMultipleNotesMode.Copy
          : CollectAttachmentUsedByMultipleNotesMode.Skip;
      }

      if (
        legacySettings.warningVersion && compare(legacySettings.warningVersion, '9.2.0') < 0
        // eslint-disable-next-line no-template-curly-in-string
        && (legacySettings.markdownUrlFormat === '${generatedAttachmentFilePath}' || legacySettings.markdownUrlFormat === '${noteFilePath}')
      ) {
        invokeAsyncSafely(async () => {
          await this.plugin.waitForLifecycleEvent('layoutReady');
          await alert({
            app: this.app,
            message: createFragment((f) => {
              f.appendText('You have potentially incorrect value set for the ');
              appendCodeBlock(f, 'Markdown URL format');
              f.appendText(' setting. Please refer to the ');
              f.createEl('a', {
                href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#markdown-url-format',
                text: 'documentation'
              });
              f.appendText(' for more information. This message will not be shown again.');
            })
          });
        });
      }

      legacySettings.warningVersion = this.plugin.manifest.version;
    });
  }

  protected override registerValidators(): void {
    this.registerValidator('attachmentFolderPath', async (value) =>
      await validatePath({
        app: this.app,
        areTokensAllowed: true,
        path: value
      }));
    this.registerValidator('generatedAttachmentFileName', (value) =>
      validateFileName({
        app: this.app,
        areSingleDotsAllowed: false,
        fileName: value,
        isEmptyAllowed: false,
        tokenValidationMode: TokenValidationMode.Validate
      }));
    this.registerValidator('specialCharacters', (value): MaybeReturn<string> => {
      if (value.includes('/')) {
        return 'Special characters must not contain /';
      }
    });

    this.registerValidator('specialCharactersReplacement', (value): MaybeReturn<string> => {
      if (getOsUnsafePathCharsRegExp().exec(value)) {
        return 'Special character replacement must not contain invalid file name path characters.';
      }
    });

    this.registerValidator('duplicateNameSeparator', async (value): Promise<MaybeReturn<string>> => {
      return await validateFileName({
        app: this.app,
        areSingleDotsAllowed: false,
        fileName: `foo${value}1`,
        isEmptyAllowed: false,
        tokenValidationMode: TokenValidationMode.Error
      });
    });

    this.registerValidator('includePaths', (value): MaybeReturn<string> => {
      return pathsValidator(value);
    });

    this.registerValidator('excludePaths', (value): MaybeReturn<string> => {
      return pathsValidator(value);
    });

    this.registerValidator('customTokensStr', (value): MaybeReturn<string> => {
      return this.customTokensValidator(value);
    });
  }

  private customTokensValidator(customTokensStr: string): MaybeReturn<string> {
    if (this.shouldDebounceCustomTokensValidation) {
      this.customTokensValidatorDebounced(customTokensStr);
    } else {
      this.customTokensValidatorImpl(customTokensStr);
    }

    return this.lastCustomTokenValidatorResult ?? undefined;
  }

  private customTokensValidatorImpl(customTokensStr: string): void {
    const customTokens = parseCustomTokens(customTokensStr);
    this.lastCustomTokenValidatorResult = customTokens === null ? 'Invalid custom tokens code' : undefined;
  }

  private replaceLegacyTokens(str: string | undefined): string {
    if (str === undefined) {
      return '';
    }

    const TOKEN_NAME_MAP: Record<string, string> = {
      fileCreationDate: 'noteFileCreationDate',
      fileModificationDate: 'noteFileModificationDate',
      fileName: 'noteFileName',
      filePath: 'noteFilePath',
      folderName: 'noteFolderName',
      folderPath: 'noteFolderPath',
      originalCopiedFileExtension: 'originalAttachmentFileExtension',
      originalCopiedFileName: 'originalAttachmentFileName',
      randomDigit: 'random:D',
      randomDigitOrLetter: 'random:DL',
      randomLetter: 'random:L',
      uuid: 'random:uuid'
    };

    for (const [oldTokenName, newTokenName] of Object.entries(TOKEN_NAME_MAP)) {
      str = replaceAll(str, new RegExp(`\\\${${oldTokenName}(?<Suffix>[:}])`, 'i'), `\${${newTokenName}$<Suffix>`);
      str = replaceAll(str, `substitutions.${oldTokenName}`, `substitutions.${newTokenName}`);
    }

    return str;
  }
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  // eslint-disable-next-line no-template-curly-in-string
  return str.replaceAll('${date}', `\${date:${dateTimeFormat}}`);
}

function commentOut(str: string): string {
  return str.replaceAll(/^/gm, '// ');
}

function pathsValidator(paths: string[]): MaybeReturn<string> {
  for (const path of paths) {
    if (path.startsWith('/') && path.endsWith('/')) {
      const regExp = path.slice(1, -1);
      if (!isValidRegExp(regExp)) {
        return `Invalid regular expression ${path}`;
      }
    }
  }
}
