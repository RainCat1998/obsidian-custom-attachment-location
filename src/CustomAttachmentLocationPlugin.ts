import {
  normalizePath,
  Notice,
  Plugin,
  TAbstractFile,
  TFile,
  Vault,
  type ListedFiles,
} from "obsidian";
import CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import CustomAttachmentLocationPluginSettingsTab from "./CustomAttachmentLocationPluginSettingsTab.ts";
import { posix } from "@jinder/path";
import { convertAsyncToSync } from "./Async.ts";
import {
  blobToArrayBuffer,
  blobToJpegArrayBuffer,
  isImageFile
} from "./Blob.ts";
import {
  getAttachmentFolderFullPath,
  getPastedFileName
} from "./AttachmentPath.ts";
import { around } from "monkey-around";
import { createFolderSafe } from "./Vault.ts";

type GetAvailablePathForAttachmentsFn = (filename: string, extension: string, file: TAbstractFile) => Promise<string>;

export default class CustomAttachmentLocationPlugin extends Plugin {
  private _settings!: CustomAttachmentLocationPluginSettings;

  public get settings(): CustomAttachmentLocationPluginSettings {
    return CustomAttachmentLocationPluginSettings.clone(this._settings);
  }

  public override async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new CustomAttachmentLocationPluginSettingsTab(this));
    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

    console.debug("loading plugin");

    await this.loadSettings();

    this.registerEvent(this.app.vault.on("delete", convertAsyncToSync(this.handleDelete.bind(this))));
    this.registerEvent(this.app.vault.on("rename", convertAsyncToSync(this.handleRename.bind(this))));
    this.registerDomEvent(document, "paste", convertAsyncToSync(this.handlePasteAndDrop.bind(this)), { capture: true });
    this.registerDomEvent(document, "drop", convertAsyncToSync(this.handlePasteAndDrop.bind(this)), { capture: true });
  }

  public async saveSettings(newSettings: CustomAttachmentLocationPluginSettings): Promise<void> {
    this._settings = CustomAttachmentLocationPluginSettings.clone(newSettings);
    await this.saveData(this._settings);
  }

  private onLayoutReady(): void {
    this.register(around(this.app.vault, {
      getAvailablePathForAttachments: (originalFn: GetAvailablePathForAttachmentsFn): GetAvailablePathForAttachmentsFn => async (filename, extension, file): Promise<string> =>
        this.getAvailablePathForAttachments(filename, extension, file, originalFn)
    }));
  }

  private async loadSettings(): Promise<void> {
    this._settings = CustomAttachmentLocationPluginSettings.load(await this.loadData());

    // eslint-disable-next-line deprecation/deprecation
    if (!this._settings.dateTimeFormat && !this._settings.pastedImageFileName) {
      return;
    }

    // eslint-disable-next-line deprecation/deprecation
    const dateTimeFormat = this._settings.dateTimeFormat || "YYYYMMDDHHmmssSSS";

    this._settings.attachmentFolderPath = this.addDateTimeFormat(this._settings.attachmentFolderPath, dateTimeFormat);

    // eslint-disable-next-line deprecation/deprecation
    this._settings.pastedFileName = this.addDateTimeFormat(this._settings.pastedFileName || this._settings.pastedImageFileName || "file-${date}", dateTimeFormat);

    // eslint-disable-next-line deprecation/deprecation
    this._settings.dateTimeFormat = "";

    // eslint-disable-next-line deprecation/deprecation
    this._settings.pastedImageFileName = "";

    await this.saveSettings(this._settings);
  }

  private addDateTimeFormat(str: string, dateTimeFormat: string): string {
    return str.replaceAll("${date}", `\${date:${dateTimeFormat}}`);
  }

  private async handleRename(newFile: TAbstractFile, oldFilePath: string): Promise<void> {
    console.debug("Handle Rename");

    if (!(newFile instanceof TFile)) {
      return;
    }

    if (newFile.extension !== "md") {
      return;
    }

    const newName = newFile.basename;

    const oldName = posix.basename(oldFilePath, ".md");

    const oldMdFolderPath: string = posix.dirname(oldFilePath);
    const oldAttachmentFolderPath: string = await getAttachmentFolderFullPath(this, oldMdFolderPath, oldName);
    const newAttachmentFolderPath: string = posix.join(posix.dirname(oldAttachmentFolderPath), newName);

    if (!this._settings.autoRenameFolder) {
      return;
    }

    if (await this.app.vault.adapter.exists(oldAttachmentFolderPath) && (oldAttachmentFolderPath !== newAttachmentFolderPath)) {
      const folder = this.app.vault.getAbstractFileByPath(oldAttachmentFolderPath);

      if (folder == null) {
        return;
      }

      const newAttachmentParentFolderPath: string = posix.dirname(newAttachmentFolderPath);
      await createFolderSafe(this.app, newAttachmentParentFolderPath);

      await this.app.fileManager.renameFile(folder, newAttachmentFolderPath);

      const oldAttachmentParentFolderPath: string = posix.dirname(oldAttachmentFolderPath);
      const oldAttachmentParentFolderList: ListedFiles = await this.app.vault.adapter.list(oldAttachmentParentFolderPath);
      if (oldAttachmentParentFolderList.folders.length === 0 && oldAttachmentParentFolderList.files.length === 0) {
        await this.app.vault.adapter.rmdir(oldAttachmentParentFolderPath, true);
      }
    }

    //if autoRenameFiles is off
    if (!this._settings.autoRenameFiles) {
      return;
    }

    const embeds = this.app.metadataCache.getCache(newFile.path)?.embeds;
    if (!embeds) {
      return;
    }

    const files: string[] = [];

    for (const embed of embeds) {
      const link = embed.link;
      if (link.endsWith(".png") || link.endsWith("jpeg")) {
        files.push(posix.basename(link));
      } else {
        continue;
      }
    }

    const attachmentFiles: ListedFiles = await this.app.vault.adapter.list(newAttachmentFolderPath);
    for (const file of attachmentFiles.files) {
      console.debug(file);
      const filePath = file;
      let fileName = posix.basename(filePath);
      if ((files.indexOf(fileName) > -1) && fileName.contains(oldName)) {
        fileName = fileName.replace(oldName, newName);
        const newFilePath = normalizePath(posix.join(newAttachmentFolderPath, fileName));
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file == null) {
          continue;
        }
        await this.app.fileManager.renameFile(file, newFilePath);
      } else {
        continue;
      }
    }
  }

  private async handleDelete(file: TAbstractFile): Promise<void> {
    if (!(file instanceof TFile)) {
      return;
    }

    if (file.extension.toLowerCase() !== "md") {
      return;
    }

    const mdFileName = file.basename;
    const mdFolderPath: string = posix.dirname(file.path);
    const fullPath = await getAttachmentFolderFullPath(this, mdFolderPath, mdFileName);

    const attachmentFolder = this.app.vault.getFolderByPath(fullPath);

    if (!attachmentFolder) {
      return;
    }

    const childFiles: TFile[] = [];

    Vault.recurseChildren(attachmentFolder, (child: TAbstractFile) => {
      if (child instanceof TFile) {
        childFiles.push(child);
      }
    });

    let canRemoveFolder = true;

    for (const child of childFiles) {
      const backlinks = this.app.metadataCache.getBacklinksForFile(child);
      backlinks.removeKey(file.path);
      if (backlinks.count() !== 0) {
        canRemoveFolder = false;
        new Notice(`Attachment ${child.path} is still used by other notes. It will not be deleted.`);
      } else {
        await this.app.vault.delete(child);
      }
    }

    if (canRemoveFolder) {
      await this.app.vault.delete(attachmentFolder, true);
    }
  }

  private async getAvailablePathForAttachments(filename: string, extension: string, file: TAbstractFile, originalFn: GetAvailablePathForAttachmentsFn): Promise<string> {
    if (!(file instanceof TFile)) {
      return await originalFn.call(this.app.vault, filename, extension, file);
    }

    if (!this.isNote(file)) {
      return await originalFn.call(this.app.vault, filename, extension, file);
    }

    const noteFileName = file.basename;
    const noteFolderPath: string = posix.dirname(file.path);
    const attachmentFolderFullPath = await getAttachmentFolderFullPath(this, noteFolderPath, noteFileName);
    await createFolderSafe(this.app, attachmentFolderFullPath);
    return this.app.vault.getAvailablePath(posix.join(attachmentFolderFullPath, filename), extension);
  }

  private async handlePasteAndDrop(event: ClipboardEvent | DragEvent): Promise<void> {
    type HandledEvent = {
      handled?: boolean
    };

    let handledEvent = event as HandledEvent;

    if (handledEvent.handled) {
      return;
    }

    const targetType = this.getTargetType(event.target);

    if (!targetType) {
      return;
    }

    const isPaste = event instanceof ClipboardEvent;

    console.debug(`Handle ${targetType} ${isPaste ? "Paste" : "Drop"}`);

    const noteFile = this.app.workspace.getActiveFile();

    if (!this.isNote(noteFile)) {
      return;
    }

    const dataTransfer = isPaste ? event.clipboardData : event.dataTransfer;

    if (!dataTransfer) {
      return;
    }

    if (!event.target) {
      return;
    }

    event.preventDefault();

    type PastedEntry = {
      file?: File;
      textPromise?: Promise<string>;
      type: string;
    };

    const pastedEntries: PastedEntry[] = Array.from(dataTransfer.items).map((item) => {
      const type = item.type;
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (!file) {
          throw new Error("Could not get file from item");
        }
        return {
          file,
          type
        };
      } else if (item.kind === "string") {
        const textPromise = new Promise<string>(resolve => item.getAsString(text => resolve(text)));
        return {
          textPromise,
          type
        };
      } else {
        throw new Error(`Unsupported item kind ${item.kind}`);
      }
    });

    const newDataTransfer = new DataTransfer();

    const shouldRenameAttachments = isPaste || this._settings.renameAttachmentsOnDragAndDrop;
    const shouldConvertImages = this._settings.convertImagesToJpeg && (isPaste || this._settings.convertImagesOnDragAndDrop);

    for (const entry of pastedEntries) {
      if (entry.textPromise) {
        newDataTransfer.items.add(await entry.textPromise, entry.type);
      } else if (entry.file) {
        let extension = posix.extname(entry.file.name).slice(1);
        const originalCopiedFileName = posix.basename(entry.file.name, "." + extension);

        let fileArrayBuffer: ArrayBuffer;
        if (shouldConvertImages && isImageFile(entry.file)) {
          fileArrayBuffer = await blobToJpegArrayBuffer(entry.file, this._settings.jpegQuality);
          extension = "jpg";
        } else {
          fileArrayBuffer = await blobToArrayBuffer(entry.file);
        }

        const filename = shouldRenameAttachments ? await getPastedFileName(this, noteFile.basename, originalCopiedFileName) : originalCopiedFileName;

        const renamedFile = new File([new Blob([fileArrayBuffer])], filename + "." + extension, { type: "application/octet-stream" });
        newDataTransfer.items.add(renamedFile);
      }
    }

    const newEvent = isPaste ? new ClipboardEvent("paste", {
      clipboardData: newDataTransfer,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed
    }) : new DragEvent("drop", {
      dataTransfer: newDataTransfer,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed,
      clientX: event.clientX,
      clientY: event.clientY
    });

    handledEvent = newEvent as HandledEvent;
    handledEvent.handled = true;

    event.target.dispatchEvent(newEvent);
  }

  private isNote(file: TFile | null): file is TFile {
    if (!file) {
      return false;
    }

    const extension = file.extension.toLowerCase();
    return extension === "md" || extension === "canvas";
  }

  private getTargetType(target: EventTarget | null): string | null {
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    if (target.closest(".markdown-source-view")) {
      return "Note";
    }

    if (target.closest(".canvas-wrapper")) {
      return "Canvas";
    }

    return null;
  }
}
