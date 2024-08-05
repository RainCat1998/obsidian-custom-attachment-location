export default class CustomAttachmentLocationPluginLegacySettings {
  public attachmentFolderPath: string = "./assets/${filename}";
  public autoRenameFiles: boolean = false;
  public autoRenameFolder: boolean = true;
  public convertImagesToJpeg: boolean = false;
  public convertImagesOnDragAndDrop: boolean = false;
  public dateTimeFormat: string = "";
  public duplicateNameSeparator: string = " ";
  public jpegQuality: number = 0.8;
  public keepEmptyAttachmentFolders: boolean = false;
  public pastedFileName: string = "file-${date:YYYYMMDDHHmmssSSS}";
  public pastedImageFileName: string = "";
  public renamePastedFilesWithKnownNames: boolean = false;
  public renameAttachmentsOnDragAndDrop: boolean = false;
  public replaceWhitespace: boolean = false;
  public toLowerCase: boolean = false;
}
