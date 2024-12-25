import { PluginSettingsBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsBase';

export class CustomAttachmentLocationPluginSettings extends PluginSettingsBase {
  public attachmentFolderPath = './assets/${filename}';

  public autoRenameFiles = false;
  public autoRenameFolder = true;
  public convertImagesOnDragAndDrop = false;
  public convertImagesToJpeg = false;
  public deleteOrphanAttachments = false;
  public duplicateNameSeparator = ' ';
  public jpegQuality = 0.8;
  public keepEmptyAttachmentFolders = false;
  public pastedFileName = 'file-${date:YYYYMMDDHHmmssSSS}';
  public renameAttachmentsOnDragAndDrop = false;
  public renameCollectedFiles = false;
  public renameOnlyImages = true;
  public renamePastedFilesWithKnownNames = false;
  public replaceWhitespace = false;
  public toLowerCase = false;
  #shouldSave = false;
  public constructor(data: unknown) {
    super();
    this.init(data);
  }

  public override shouldSaveAfterLoad(): boolean {
    return this.#shouldSave;
  }

  protected override initFromRecord(record: Record<string, unknown>): void {
    const legacySettings = record as Partial<LegacySettings>;
    if (legacySettings.dateTimeFormat || legacySettings.pastedImageFileName) {
      const dateTimeFormat = legacySettings.dateTimeFormat ?? 'YYYYMMDDHHmmssSSS';
      legacySettings.attachmentFolderPath = addDateTimeFormat(legacySettings.attachmentFolderPath ?? '', dateTimeFormat);
      legacySettings.pastedFileName = addDateTimeFormat(legacySettings.pastedFileName ?? legacySettings.pastedImageFileName ?? 'file-${date}', dateTimeFormat);
      delete legacySettings.dateTimeFormat;
      delete legacySettings.pastedImageFileName;
      this.#shouldSave = true;
    }

    super.initFromRecord(legacySettings);
  }
}

class LegacySettings extends CustomAttachmentLocationPluginSettings {
  public dateTimeFormat = '';
  public pastedImageFileName = '';
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  return str.replaceAll('${date}', `\${date:${dateTimeFormat}}`);
}
