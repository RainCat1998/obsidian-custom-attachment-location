import { deleteProperties } from 'obsidian-dev-utils/Object';
import { PluginSettingsBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsBase';

import { Substitutions } from './Substitutions.ts';

export class CustomAttachmentLocationPluginSettings extends PluginSettingsBase {
  // eslint-disable-next-line no-template-curly-in-string
  public attachmentFolderPath = './assets/${filename}';
  public convertImagesOnDragAndDrop = false;
  public duplicateNameSeparator = ' ';
  // eslint-disable-next-line no-template-curly-in-string
  public generatedAttachmentFilename = 'file-${date:YYYYMMDDHHmmssSSS}';
  // eslint-disable-next-line no-magic-numbers
  public jpegQuality = 0.8;
  public renameAttachmentsOnDragAndDrop = false;
  public renameOnlyImages = true;
  public renamePastedFilesWithKnownNames = false;
  public shouldConvertPastedImagesToJpeg = false;
  public shouldDeleteOrphanAttachments = false;
  public shouldKeepEmptyAttachmentFolders = false;
  public shouldRenameAttachmentFolder = true;
  public shouldRenameAttachmentFiles = false;
  public shouldRenameAttachmentsToLowerCase = false;
  public shouldRenameCollectedAttachments = false;
  public whitespaceReplacement = '';
  public get customTokensStr(): string {
    return this._customTokensStr;
  }

  public set customTokensStr(value: string) {
    this._customTokensStr = value;
    Substitutions.registerCustomFormatters(this._customTokensStr);
  }

  private _customTokensStr = '';

  public constructor(data: unknown) {
    super();
    this.init(data);
  }

  public override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      customTokensStr: this.customTokensStr
    };
  }

  protected override initFromRecord(record: Record<string, unknown>): void {
    const legacySettings = record as Partial<LegacySettings>;
    const dateTimeFormat = legacySettings.dateTimeFormat ?? 'YYYYMMDDHHmmssSSS';
    legacySettings.attachmentFolderPath = addDateTimeFormat(legacySettings.attachmentFolderPath ?? '', dateTimeFormat);
    // eslint-disable-next-line no-template-curly-in-string
    legacySettings.generatedAttachmentFilename = addDateTimeFormat(legacySettings.generatedAttachmentFilename ?? legacySettings.pastedFileName ?? legacySettings.pastedImageFileName ?? 'file-${date}', dateTimeFormat);
    if (legacySettings.replaceWhitespace !== undefined) {
      legacySettings.whitespaceReplacement = legacySettings.replaceWhitespace ? '-' : '';
    }

    if (legacySettings.autoRenameFiles !== undefined) {
      legacySettings.shouldRenameAttachmentFiles = legacySettings.autoRenameFiles;
    }

    if (legacySettings.autoRenameFolders !== undefined) {
      legacySettings.shouldRenameAttachmentFolder = legacySettings.autoRenameFolders;
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

    this._shouldSaveAfterLoad = deleteProperties(legacySettings, [
      'autoRenameFiles',
      'autoRenameFolders',
      'dateTimeFormat',
      'deleteOrphanAttachments',
      'keepEmptyAttachmentFolders',
      'pastedImageFileName',
      'pastedFileName',
      'renameCollectedFiles',
      'replaceWhitespace',
      'toLowerCase'
    ]);
    super.initFromRecord(legacySettings);
  }
}

class LegacySettings extends CustomAttachmentLocationPluginSettings {
  public autoRenameFiles = false;
  public autoRenameFolders = true;
  public convertImagesToJpeg = false;
  public dateTimeFormat = '';
  public pastedImageFileName = '';
  public replaceWhitespace = false;
  public deleteOrphanAttachments = false;
  public keepEmptyAttachmentFolders = false;
  // eslint-disable-next-line no-template-curly-in-string
  public pastedFileName = 'file-${date:YYYYMMDDHHmmssSSS}';
  public renameCollectedFiles = false;
  public toLowerCase = false;
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  // eslint-disable-next-line no-template-curly-in-string
  return str.replaceAll('${date}', `\${date:${dateTimeFormat}}`);
}
