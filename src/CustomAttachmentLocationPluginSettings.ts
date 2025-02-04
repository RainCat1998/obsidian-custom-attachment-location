import { deleteProperties } from 'obsidian-dev-utils/Object';
import { PluginSettingsBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsBase';

import { Substitutions } from './Substitutions.ts';

export enum AttachmentRenameMode {
  None = 'None',
  // eslint-disable-next-line perfectionist/sort-enums
  OnlyPastedImages = 'Only pasted images',
  // eslint-disable-next-line perfectionist/sort-enums
  All = 'All'
}

export class CustomAttachmentLocationPluginSettings extends PluginSettingsBase {
  // eslint-disable-next-line no-template-curly-in-string
  public attachmentFolderPath = './assets/${filename}';
  public attachmentRenameMode: AttachmentRenameMode = AttachmentRenameMode.OnlyPastedImages;
  public duplicateNameSeparator = ' ';
  // eslint-disable-next-line no-template-curly-in-string
  public generatedAttachmentFilename = 'file-${date:YYYYMMDDHHmmssSSS}';
  // eslint-disable-next-line no-magic-numbers
  public jpegQuality = 0.8;
  public shouldConvertPastedImagesToJpeg = false;
  public shouldDeleteOrphanAttachments = false;
  public shouldKeepEmptyAttachmentFolders = false;
  public shouldRenameAttachmentFiles = false;
  public shouldRenameAttachmentFolder = true;
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

    this._shouldSaveAfterLoad = deleteProperties(legacySettings, [
      'autoRenameFiles',
      'autoRenameFolder',
      'convertImagesOnDragAndDrop',
      'convertImagesToJpeg',
      'dateTimeFormat',
      'deleteOrphanAttachments',
      'keepEmptyAttachmentFolders',
      'pastedFileName',
      'pastedImageFileName',
      'renameAttachmentsOnDragAndDrop',
      'renameCollectedFiles',
      'renameOnlyImages',
      'renamePastedFilesWithKnownNames',
      'replaceWhitespace',
      'toLowerCase'
    ]);
    super.initFromRecord(legacySettings);
  }
}

class LegacySettings extends CustomAttachmentLocationPluginSettings {
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
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  // eslint-disable-next-line no-template-curly-in-string
  return str.replaceAll('${date}', `\${date:${dateTimeFormat}}`);
}
