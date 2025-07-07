import type { MaybeReturn } from 'obsidian-dev-utils/Type';

import { PluginSettingsManagerBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsManagerBase';
import { EmptyAttachmentFolderBehavior } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { isValidRegExp } from 'obsidian-dev-utils/RegExp';
import { replaceAll } from 'obsidian-dev-utils/String';

import type { PluginTypes } from './PluginTypes.ts';

import { PluginSettings } from './PluginSettings.ts';
import {
  getCustomTokenFormatters,
  INVALID_FILENAME_PATH_CHARS_REG_EXP,
  validateFilename,
  validatePath
} from './Substitutions.ts';

class LegacySettings extends PluginSettings {
  public autoRenameFiles = false;
  public autoRenameFolder = true;
  public convertImagesOnDragAndDrop = false;
  public convertImagesToJpeg = false;
  public dateTimeFormat = '';
  public deleteOrphanAttachments = false;
  public keepEmptyAttachmentFolders = false;
  // eslint-disable-next-line no-template-curly-in-string
  public pastedFileName = 'file-${date:YYYYMMDDHHmmssSSS}';
  public pastedImageFileName = '';
  public renameAttachmentsOnDragAndDrop = false;
  public renameCollectedFiles = false;
  public renameOnlyImages = false;
  public renamePastedFilesWithKnownNames = false;
  public replaceWhitespace = false;
  public shouldKeepEmptyAttachmentFolders = false;
  public toLowerCase = false;
  public whitespaceReplacement = '';
}

export class PluginSettingsManager extends PluginSettingsManagerBase<PluginTypes> {
  protected override createDefaultSettings(): PluginSettings {
    return new PluginSettings();
  }

  protected override async onLoadRecord(record: Record<string, unknown>): Promise<void> {
    await super.onLoadRecord(record);
    const legacySettings = record as Partial<LegacySettings>;
    const dateTimeFormat = legacySettings.dateTimeFormat ?? 'YYYYMMDDHHmmssSSS';
    legacySettings.attachmentFolderPath = addDateTimeFormat(legacySettings.attachmentFolderPath ?? '', dateTimeFormat);

    legacySettings.generatedAttachmentFilename = addDateTimeFormat(
      // eslint-disable-next-line no-template-curly-in-string
      legacySettings.generatedAttachmentFilename ?? legacySettings.pastedFileName ?? legacySettings.pastedImageFileName ?? 'file-${date}',
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
    legacySettings.generatedAttachmentFilename = this.replaceLegacyTokens(legacySettings.generatedAttachmentFilename);
    legacySettings.markdownUrlFormat = this.replaceLegacyTokens(legacySettings.markdownUrlFormat);
    legacySettings.customTokensStr = this.replaceLegacyTokens(legacySettings.customTokensStr ?? '');
  }

  protected override registerValidators(): void {
    this.registerValidator('attachmentFolderPath', (value) => validatePath(value));
    this.registerValidator('generatedAttachmentFilename', (value) => validatePath(value));
    this.registerValidator('specialCharacters', (value): MaybeReturn<string> => {
      if (value.includes('/')) {
        return 'Special characters must not contain /';
      }
    });

    this.registerValidator('specialCharactersReplacement', (value): MaybeReturn<string> => {
      if (INVALID_FILENAME_PATH_CHARS_REG_EXP.exec(value)) {
        return 'Special character replacement must not contain invalid filename path characters.';
      }
    });

    this.registerValidator('duplicateNameSeparator', (value): MaybeReturn<string> => {
      return validateFilename(`filename${value}1`, false);
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
