import type { MaybeReturn } from 'obsidian-dev-utils/Type';
import type { Promisable } from 'type-fest';

import { PluginSettingsManagerBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsManagerBase';
import { isValidRegExp } from 'obsidian-dev-utils/RegExp';

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
  public toLowerCase = false;
  public whitespaceReplacement = '';
}

export class PluginSettingsManager extends PluginSettingsManagerBase<PluginTypes> {
  protected override addValidators(): void {
    this.addValidator('attachmentFolderPath', validatePath);
    this.addValidator('generatedAttachmentFilename', validatePath);
    this.addValidator('specialCharacters', (value): MaybeReturn<string> => {
      if (value.includes('/')) {
        return 'Special characters must not contain /';
      }
    });

    this.addValidator('specialCharactersReplacement', (value): MaybeReturn<string> => {
      if (INVALID_FILENAME_PATH_CHARS_REG_EXP.exec(value)) {
        return 'Special character replacement must not contain invalid filename path characters.';
      }
    });

    this.addValidator('duplicateNameSeparator', (value): MaybeReturn<string> => {
      return validateFilename(`filename${value}1`, false);
    });

    this.addValidator('includePaths', (value): MaybeReturn<string> => {
      return pathsValidator(value);
    });

    this.addValidator('excludePaths', (value): MaybeReturn<string> => {
      return pathsValidator(value);
    });

    this.addValidator('customTokensStr', (value): MaybeReturn<string> => {
      customTokensValidator(value);
    });
  }

  protected override createDefaultSettings(): PluginSettings {
    return new PluginSettings();
  }

  protected override onLoadRecord(record: Record<string, unknown>): Promisable<void> {
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
