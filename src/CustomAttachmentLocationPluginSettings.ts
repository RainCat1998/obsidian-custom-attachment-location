import { loadPluginSettings } from "obsidian-dev-utils/obsidian/Plugin/PluginSettings";

export default class CustomAttachmentLocationPluginSettings {
  public attachmentFolderPath: string = "./assets/${filename}";
  public autoRenameFiles: boolean = false;
  public autoRenameFolder: boolean = true;
  public convertImagesToJpeg: boolean = false;
  public convertImagesOnDragAndDrop: boolean = false;
  public duplicateNameSeparator: string = " ";
  public jpegQuality: number = 0.8;
  public keepEmptyAttachmentFolders: boolean = false;
  public pastedFileName: string = "file-${date:YYYYMMDDHHmmssSSS}";
  public renameOnlyImages: boolean = true;
  public renamePastedFilesWithKnownNames: boolean = false;
  public renameAttachmentsOnDragAndDrop: boolean = false;
  public replaceWhitespace: boolean = false;
  public toLowerCase: boolean = false;

  public static load(data: unknown): { settings: CustomAttachmentLocationPluginSettings, shouldSave: boolean } {
    const legacySettings = loadPluginSettings(() => new LegacySettings(), data);
    let shouldSave = false;
    if (legacySettings.dateTimeFormat || legacySettings.pastedImageFileName) {
      const dateTimeFormat = legacySettings.dateTimeFormat || "YYYYMMDDHHmmssSSS";
      legacySettings.attachmentFolderPath = addDateTimeFormat(legacySettings.attachmentFolderPath, dateTimeFormat);
      legacySettings.pastedFileName = addDateTimeFormat(legacySettings.pastedFileName || legacySettings.pastedImageFileName || "file-${date}", dateTimeFormat);
      legacySettings.dateTimeFormat = "";
      legacySettings.pastedImageFileName = "";
      shouldSave = true;
    }

    const settings = loadPluginSettings(() => new CustomAttachmentLocationPluginSettings(), legacySettings);
    return { settings, shouldSave };
  }
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  return str.replaceAll("${date}", `\${date:${dateTimeFormat}}`);
}

class LegacySettings extends CustomAttachmentLocationPluginSettings {
  public dateTimeFormat: string = "";
  public pastedImageFileName: string = "";
}
