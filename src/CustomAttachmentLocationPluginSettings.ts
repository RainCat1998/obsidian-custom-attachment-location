import { deleteProperties } from 'obsidian-dev-utils/Object';
import { PluginSettingsBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsBase';

import { Substitutions } from './Substitutions.ts';

export class CustomAttachmentLocationPluginSettings extends PluginSettingsBase {
  // eslint-disable-next-line no-template-curly-in-string
  public attachmentFolderPath = './assets/${filename}';

  public autoRenameFiles = false;
  public autoRenameFolder = true;
  public convertImagesOnDragAndDrop = false;
  public convertImagesToJpeg = false;
  public deleteOrphanAttachments = false;
  public duplicateNameSeparator = ' ';
  // eslint-disable-next-line no-magic-numbers
  public jpegQuality = 0.8;
  public keepEmptyAttachmentFolders = false;
  // eslint-disable-next-line no-template-curly-in-string
  public pastedFileName = 'file-${date:YYYYMMDDHHmmssSSS}';
  public renameAttachmentsOnDragAndDrop = false;
  public renameCollectedFiles = false;
  public renameOnlyImages = true;
  public renamePastedFilesWithKnownNames = false;
  public toLowerCase = false;
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
    legacySettings.pastedFileName = addDateTimeFormat(legacySettings.pastedFileName ?? legacySettings.pastedImageFileName ?? 'file-${date}', dateTimeFormat);
    if (legacySettings.replaceWhitespace !== undefined) {
      legacySettings.whitespaceReplacement = legacySettings.replaceWhitespace ? '-' : '';
    }
    this._shouldSaveAfterLoad = deleteProperties(legacySettings, ['dateTimeFormat', 'pastedImageFileName', 'replaceWhitespace']);
    super.initFromRecord(legacySettings);
  }
}

class LegacySettings extends CustomAttachmentLocationPluginSettings {
  public dateTimeFormat = '';
  public pastedImageFileName = '';
  public replaceWhitespace = false;
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  // eslint-disable-next-line no-template-curly-in-string
  return str.replaceAll('${date}', `\${date:${dateTimeFormat}}`);
}
