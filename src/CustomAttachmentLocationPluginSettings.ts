import { loadPluginSettings } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettings';

export default class CustomAttachmentLocationPluginSettings {
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

  public static load(data: unknown): { settings: CustomAttachmentLocationPluginSettings; shouldSave: boolean } {
    const legacySettings = loadPluginSettings(() => new LegacySettings(), data);
    let shouldSave = false;
    if (legacySettings.dateTimeFormat || legacySettings.pastedImageFileName) {
      const dateTimeFormat = legacySettings.dateTimeFormat || 'YYYYMMDDHHmmssSSS';
      legacySettings.attachmentFolderPath = addDateTimeFormat(legacySettings.attachmentFolderPath, dateTimeFormat);
      legacySettings.pastedFileName = addDateTimeFormat(legacySettings.pastedFileName || legacySettings.pastedImageFileName || 'file-${date}', dateTimeFormat);
      legacySettings.dateTimeFormat = '';
      legacySettings.pastedImageFileName = '';
      shouldSave = true;
    }

    const settings = loadPluginSettings(() => new CustomAttachmentLocationPluginSettings(), legacySettings);
    return { settings, shouldSave };
  }
}

class LegacySettings extends CustomAttachmentLocationPluginSettings {
  public dateTimeFormat = '';
  public pastedImageFileName = '';
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  return str.replaceAll('${date}', `\${date:${dateTimeFormat}}`);
}
