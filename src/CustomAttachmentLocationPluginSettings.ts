export default class CustomAttachmentLocationPluginSettings {
  public attachmentFolderPath: string = "./assets/${filename}";
  public autoRenameFiles: boolean = false;
  public autoRenameFolder: boolean = true;
  public dateTimeFormat: string = "YYYYMMDDHHmmssSSS";
  public jpegQuality: number = 0.8;
  public pastedImageFileName: string = "image-${date:YYYYMMDDHHmmssSSS}";
  public pngToJpeg: boolean = false;
  public replaceWhitespace: boolean = false;
  public toLowerCase: boolean = false;

  public static load(data: unknown): CustomAttachmentLocationPluginSettings {
    return CustomAttachmentLocationPluginSettings.clone(data as CustomAttachmentLocationPluginSettings);
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
