import type { MaybeReturn } from 'obsidian-dev-utils/Type';

import { debounce } from 'obsidian';
import { invokeAsyncSafely } from 'obsidian-dev-utils/Async';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
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
  public shouldRenameAttachments = true;
  public shouldRenameAttachmentsToLowerCase = false;
  public toLowerCase = false;
  public warningVersion = '';
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
      if (legacySettings.warningVersion !== undefined) {
        legacySettings.version = legacySettings.warningVersion;
      }

      if (legacySettings.version && compare(legacySettings.version, this.plugin.manifest.version) > 0) {
        invokeAsyncSafely(async () => {
          await this.plugin.waitForLifecycleEvent('layoutReady');
          await alert({
            app: this.app,
            message: createFragment((f) => {
              f.appendText(t(($) => $.pluginSettingsManager.version.part1));
              f.appendText(' ');
              appendCodeBlock(f, `${this.plugin.manifest.dir ?? ''}/data.json`);
              f.appendText(' ');
              f.appendText(t(($) => $.pluginSettingsManager.version.part2));
              f.appendText(' ');
              appendCodeBlock(f, legacySettings.version ?? '');
              f.appendText(', ');
              f.appendText(t(($) => $.pluginSettingsManager.version.part3));
              f.appendText(' ');
              appendCodeBlock(f, this.plugin.manifest.version);
              f.appendText('. ');
              f.appendText(t(($) => $.pluginSettingsManager.version.part4));
            })
          });
        });
        legacySettings.version = this.plugin.manifest.version;
        return;
      }

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
        legacySettings.shouldRenameAttachmentFiles = legacySettings.autoRenameFiles;
      }

      if (legacySettings.autoRenameFolder !== undefined) {
        legacySettings.shouldRenameAttachmentFolder = legacySettings.autoRenameFolder;
      }

      if (legacySettings.shouldRenameAttachments !== undefined) {
        legacySettings.shouldRenameAttachmentFolder = legacySettings.shouldRenameAttachments;
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
              f.appendText(t(($) => $.pluginSettingsManager.legacyRenameAttachmentsToLowerCase.part1));
              f.appendText(' ');
              appendCodeBlock(f, t(($) => $.pluginSettingsTab.renameAttachmentsToLowerCase));
              f.appendText(' ');
              f.appendText(t(($) => $.pluginSettingsManager.legacyRenameAttachmentsToLowerCase.part2));
              f.appendText(' ');
              appendCodeBlock(f, 'lower');
              f.appendText(' ');
              f.appendText(t(($) => $.pluginSettingsManager.legacyRenameAttachmentsToLowerCase.part3));
              f.appendText(' ');
              f.createEl('a', {
                href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
                text: t(($) => $.pluginSettingsManager.legacyRenameAttachmentsToLowerCase.part4)
              });
              f.appendText(' ');
              f.appendText(t(($) => $.pluginSettingsManager.legacyRenameAttachmentsToLowerCase.part5));
            })
          });
        });
      }

      if (legacySettings.customTokensStr && legacySettings.version && compare(legacySettings.version, '9.0.0') < 0) {
        legacySettings.customTokensStr = `${t(($) => $.pluginSettingsManager.customToken.codeComment)}

${commentOut(legacySettings.customTokensStr)}
`;
        invokeAsyncSafely(async () => {
          await this.plugin.waitForLifecycleEvent('layoutReady');
          await alert({
            app: this.app,
            message: createFragment((f) => {
              f.appendText(t(($) => $.pluginSettingsManager.customToken.deprecated.part1));
              f.createEl('a', {
                href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens',
                text: t(($) => $.pluginSettingsManager.customToken.deprecated.part2)
              });
              f.appendText(' ');
              f.appendText(t(($) => $.pluginSettingsManager.customToken.deprecated.part3));
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
        legacySettings.version && compare(legacySettings.version, '9.2.0') < 0
        // eslint-disable-next-line no-template-curly-in-string
        && (legacySettings.markdownUrlFormat === '${generatedAttachmentFilePath}' || legacySettings.markdownUrlFormat === '${noteFilePath}')
      ) {
        invokeAsyncSafely(async () => {
          await this.plugin.waitForLifecycleEvent('layoutReady');
          await alert({
            app: this.app,
            message: createFragment((f) => {
              f.appendText(t(($) => $.pluginSettingsManager.markdownUrlFormat.deprecated.part1));
              appendCodeBlock(f, t(($) => $.pluginSettingsTab.markdownUrlFormat.name));
              f.appendText(t(($) => $.pluginSettingsManager.markdownUrlFormat.deprecated.part2));
              f.createEl('a', {
                href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#markdown-url-format',
                text: t(($) => $.pluginSettingsManager.markdownUrlFormat.deprecated.part3)
              });
              f.appendText(' ');
              f.appendText(t(($) => $.pluginSettingsManager.markdownUrlFormat.deprecated.part4));
              f.appendText(' ');
              f.appendText(t(($) => $.pluginSettingsManager.markdownUrlFormat.deprecated.part5));
            })
          });
        });
      }

      if (legacySettings.version && compare(legacySettings.version, '9.16.0') < 0 && legacySettings.specialCharacters === '#^[]|*\\<>:?') {
        legacySettings.specialCharacters = '#^[]|*\\<>:?/';
        invokeAsyncSafely(async () => {
          await this.plugin.waitForLifecycleEvent('layoutReady');
          await alert({
            app: this.app,
            message: createFragment((f) => {
              f.appendText(t(($) => $.pluginSettingsManager.specialCharacters.part1));
              appendCodeBlock(f, t(($) => $.pluginSettingsTab.specialCharacters.name));
              f.appendText(t(($) => $.pluginSettingsManager.specialCharacters.part2));
            })
          });
        });
      }

      legacySettings.version = this.plugin.manifest.version;
    });
  }

  protected override registerValidators(): void {
    this.registerValidator('attachmentFolderPath', async (value) =>
      await validatePath({
        areTokensAllowed: true,
        path: value,
        plugin: this.plugin
      }));
    this.registerValidator('generatedAttachmentFileName', async (value) =>
      await validatePath({
        areTokensAllowed: true,
        path: value,
        plugin: this.plugin
      }));

    this.registerValidator('specialCharactersReplacement', (value): MaybeReturn<string> => {
      if (getOsUnsafePathCharsRegExp().exec(value)) {
        return t(($) => $.pluginSettingsManager.validation.specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters);
      }
    });

    this.registerValidator('duplicateNameSeparator', async (value): Promise<MaybeReturn<string>> => {
      return await validateFileName({
        areSingleDotsAllowed: false,
        fileName: `foo${value}1`,
        isEmptyAllowed: false,
        plugin: this.plugin,
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
    this.lastCustomTokenValidatorResult = customTokens === null ? t(($) => $.pluginSettingsManager.validation.invalidCustomTokensCode) : undefined;
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
        return t(($) => $.pluginSettingsManager.validation.invalidRegularExpression, { regExp: path });
      }
    }
  }
}
