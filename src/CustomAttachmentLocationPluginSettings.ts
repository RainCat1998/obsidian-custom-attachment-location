export default class CustomAttachmentLocationPluginSettings {
  public attachmentFolderPath: string = "./assets/${filename}";
  public pastedImageFileName: string = "image-${date:YYYYMMDDHHmmssSSS}";
  public dateTimeFormat: string = "YYYYMMDDHHmmssSSS";
  public autoRenameFolder: boolean = true;
  public autoRenameFiles: boolean = false;

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
