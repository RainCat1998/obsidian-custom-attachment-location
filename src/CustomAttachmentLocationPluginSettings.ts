import CustomAttachmentLocationPluginLegacySettings from "./CustomAttachmentLocationPluginLegacySettings.ts";

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

  public static load(data: unknown): CustomAttachmentLocationPluginSettings {
    const legacySettings = new CustomAttachmentLocationPluginLegacySettings();
    Object.assign(legacySettings, data);

    const dateTimeFormat = legacySettings.dateTimeFormat || "YYYYMMDDHHmmssSSS";
    legacySettings.attachmentFolderPath = addDateTimeFormat(legacySettings.attachmentFolderPath, dateTimeFormat);
    legacySettings.pastedFileName = addDateTimeFormat(legacySettings.pastedFileName || legacySettings.pastedImageFileName || "file-${date}", dateTimeFormat);
    legacySettings.dateTimeFormat = "";
    legacySettings.pastedImageFileName = "";

    return CustomAttachmentLocationPluginSettings.clone(legacySettings as CustomAttachmentLocationPluginSettings);
  }

  public static clone(settings?: CustomAttachmentLocationPluginSettings): CustomAttachmentLocationPluginSettings {
    const target = new CustomAttachmentLocationPluginSettings();
    if (settings) {
      for (const key of Object.keys(target) as Array<keyof CustomAttachmentLocationPluginSettings>) {
        if (key in settings && typeof settings[key] === typeof target[key]) {
          Object.assign(target, { [key]: settings[key] });
        }
      }
    }

    return target;
  }
}

function addDateTimeFormat(str: string, dateTimeFormat: string): string {
  return str.replaceAll("${date}", `\${date:${dateTimeFormat}}`);
}
