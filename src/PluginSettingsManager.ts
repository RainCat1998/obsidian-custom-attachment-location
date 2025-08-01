import type { MaybeReturn } from 'obsidian-dev-utils/Type';

import { PluginSettingsManagerBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsManagerBase';
import { EmptyAttachmentFolderBehavior } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { isValidRegExp } from 'obsidian-dev-utils/RegExp';
import { replaceAll } from 'obsidian-dev-utils/String';

import type { PluginTypes } from './PluginTypes.ts';

import {
  CollectAttachmentUsedByMultipleNotesMode,
  PluginSettings
} from './PluginSettings.ts';
import {
  getCustomTokenFormatters,
  INVALID_FILENAME_PATH_CHARS_REG_EXP,
  validateFileName,
  validatePath
} from './Substitutions.ts';

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
  public toLowerCase = false;
  public whitespaceReplacement = '';
}

export class PluginSettingsManager extends PluginSettingsManagerBase<PluginTypes> {
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
        legacySettings.shouldRenameAttachmentFiles = legacySettings.autoRenameFiles;
      }

      if (legacySettings.autoRenameFolder !== undefined) {
        legacySettings.shouldRenameAttachmentFolder = legacySettings.autoRenameFolder;
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

      if (legacySettings.toLowerCase !== undefined) {
        legacySettings.shouldRenameAttachmentsToLowerCase = legacySettings.toLowerCase;
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
    });
  }

  protected override registerValidators(): void {
    this.registerValidator('attachmentFolderPath', async (value) => await validatePath(this.app, value));
    this.registerValidator('generatedAttachmentFileName', (value) => validateFileName(this.app, value));
    this.registerValidator('specialCharacters', (value): MaybeReturn<string> => {
      if (value.includes('/')) {
        return 'Special characters must not contain /';
      }
    });

    this.registerValidator('specialCharactersReplacement', (value): MaybeReturn<string> => {
      if (INVALID_FILENAME_PATH_CHARS_REG_EXP.exec(value)) {
        return 'Special character replacement must not contain invalid file name path characters.';
      }
    });

    this.registerValidator('duplicateNameSeparator', async (value): Promise<MaybeReturn<string>> => {
      return await validateFileName(this.app, `foo${value}1`, false);
    });

    this.registerValidator('includePaths', (value): MaybeReturn<string> => {
      return pathsValidator(value);
    });

    this.registerValidator('excludePaths', (value): MaybeReturn<string> => {
      return pathsValidator(value);
    });

    this.registerValidator('customTokensStr', (value): MaybeReturn<string> => {
      customTokensValidator(value);
    });
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

function customTokensValidator(value: string): MaybeReturn<string> {
  const formatters = getCustomTokenFormatters(value);
  if (formatters === null) {
    return 'Invalid custom tokens code';
  }
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
