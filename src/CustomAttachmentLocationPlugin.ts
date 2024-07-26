import {
  Editor,
  MarkdownView,
  normalizePath,
  Notice,
  Plugin,
  TAbstractFile,
  TFile,
  Vault,
  type ListedFiles,
  type MarkdownFileInfo
} from "obsidian";
import CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import CustomAttachmentLocationPluginSettingsTab from "./CustomAttachmentLocationPluginSettingsTab.ts";
import { posix } from "@jinder/path";
import { convertAsyncToSync } from "./Async.ts";
import {
  blobToImageArrayBuffer,
  blobToJpegArrayBuffer
} from "./Blob.ts";
import {
  getAttachmentFolderFullPath,
  getAttachmentFolderPath,
  getPastedImageFileName
} from "./AttachmentPath.ts";
import { around } from "monkey-around";
import { createFolderSafe } from "./Vault.ts";

export default class CustomAttachmentLocationPlugin extends Plugin {
  private _settings!: CustomAttachmentLocationPluginSettings;
  private originalAttachmentFolderPath: string = "";

  public get settings(): CustomAttachmentLocationPluginSettings {
    return CustomAttachmentLocationPluginSettings.clone(this._settings);
  }

  public override async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new CustomAttachmentLocationPluginSettingsTab(this));
    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

    console.debug("loading plugin");

    await this.loadSettings();
    this.backupConfigs();

    this.registerEvent(this.app.workspace.on("editor-paste", convertAsyncToSync(this.handlePaste.bind(this))));
    this.registerEvent(this.app.workspace.on("editor-drop", convertAsyncToSync(this.handleDrop.bind(this))));

    this.registerEvent(this.app.vault.on("delete", convertAsyncToSync(this.handleDelete.bind(this))));
    this.registerEvent(this.app.vault.on("rename", convertAsyncToSync(this.handleRename.bind(this))));

    this.register(this.restoreConfigs.bind(this));

    type EditorCallbackFn = (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => unknown;

    const editAttachFileCommand = this.app.commands.findCommand("editor:attach-file")!;
    this.register(around(editAttachFileCommand, {
      "editorCallback": (originalFn?: EditorCallbackFn): EditorCallbackFn => async (editor, ctx): Promise<unknown> => {
        await this.updateAttachmentFolderConfigForNote(this.app.workspace.getActiveFile());
        return originalFn?.call(editAttachFileCommand, editor, ctx);
      }
    }));
  }

  public async saveSettings(newSettings: CustomAttachmentLocationPluginSettings): Promise<void> {
    this._settings = CustomAttachmentLocationPluginSettings.clone(newSettings);
    await this.saveData(this._settings);
  }

  private async onLayoutReady(): Promise<void> {
  }

  private async loadSettings(): Promise<void> {
    this._settings = CustomAttachmentLocationPluginSettings.load(await this.loadData());
    const dateTimeFormat = this._settings.dateTimeFormat || "YYYYMMDDHHmmssSSS";
    const attachmentFolderPath = this._settings.attachmentFolderPath.replaceAll("{date}", `{date:${dateTimeFormat}}`);
    const pastedImageFileName = this._settings.pastedImageFileName.replaceAll("{date}", `{date:${dateTimeFormat}}`);

    if (this._settings.attachmentFolderPath !== attachmentFolderPath || this._settings.pastedImageFileName !== pastedImageFileName) {
      this._settings.attachmentFolderPath = attachmentFolderPath;
      this._settings.pastedImageFileName = pastedImageFileName;
      await this.saveSettings(this._settings);
    }
  }

  private backupConfigs(): void {
    this.originalAttachmentFolderPath = this.app.vault.getConfig("attachmentFolderPath") as string;
  }

  private restoreConfigs(): void {
    this.updateAttachmentFolderConfig(this.originalAttachmentFolderPath);
  }

  private updateAttachmentFolderConfig(path: string): void {
    this.app.vault.setConfig("attachmentFolderPath", path);
  }

  private async handlePaste(event: ClipboardEvent, editor: Editor, view: MarkdownView | MarkdownFileInfo): Promise<void> {
    console.debug("Handle Paste");

    if (!view.file) {
      return;
    }

    const clipBoardData = event.clipboardData;
    if (clipBoardData == null || clipBoardData.items == null) {
      return;
    }
    const clipBoardItems = clipBoardData.items;
    if (!clipBoardData.getData("text/plain")) {
      type PastedImageEntry = {
        extension: string;
        pasteImage: File;
      };

      const pastedImageEntries: PastedImageEntry[] = [];

      for (const i in clipBoardItems) {
        if (!clipBoardItems.hasOwnProperty(i)) {
          continue;
        }
        const item = clipBoardItems[i]!;
        if (item.kind !== "file") {
          continue;
        }
        if (!(item.type === "image/png" || item.type === "image/jpeg")) {
          continue;
        }

        const pasteImage = item.getAsFile();
        if (!pasteImage) {
          continue;
        }

        let extension = "";
        item.type === "image/png" ? extension = "png" : item.type === "image/jpeg" && (extension = "jpeg");
        pastedImageEntries.push({ extension, pasteImage });
      }

      let insertedMarkdown = "";

      if (pastedImageEntries.length) {
        event.preventDefault();

        await this.updateAttachmentFolderConfigForNote(view.file, true);
        const mdFileName = view.file.basename;

        for (const entry of pastedImageEntries) {
          let img: ArrayBuffer;
          if (this._settings.pngToJpeg && entry.extension == "png") {
            img = await blobToJpegArrayBuffer(entry.pasteImage, this._settings.jpegQuality);
            entry.extension = "jpg";
          } else {
            img = await blobToImageArrayBuffer(entry.pasteImage);
          }

          const name = getPastedImageFileName(this, mdFileName);
          const imageFile = await this.app.saveAttachment(name, entry.extension, img);
          insertedMarkdown += this.app.fileManager.generateMarkdownLink(imageFile, view.file.path);
          insertedMarkdown += "\n\n";
        }
      }

      editor.replaceSelection(insertedMarkdown);
    }
  }

  private async handleDrop(_: DragEvent, _2: Editor, view: MarkdownView | MarkdownFileInfo): Promise<void> {
    console.debug("Handle Drop");

    if (!view.file) {
      return;
    }

    await this.updateAttachmentFolderConfigForNote(view.file, true);
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

    // why this ?
    // hints: after rename seems attachmentFolderConfig will be reset
    this.updateAttachmentFolderConfig(await getAttachmentFolderPath(this, newName));

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

  private async updateAttachmentFolderConfigForNote(note: TFile | null, createAttachmentFolderIfMissing?: boolean): Promise<void> {
    if (!note) {
      console.debug("No file open");
      return;
    }

    if (note.extension.toLowerCase() !== "md") {
      return;
    }

    const mdFileName = note.basename;

    const path = await getAttachmentFolderPath(this, mdFileName);
    this.updateAttachmentFolderConfig(path);

    if (createAttachmentFolderIfMissing) {
      const mdFolderPath: string = posix.dirname(note.path);
      const fullPath = await getAttachmentFolderFullPath(this, mdFolderPath, mdFileName);
      await createFolderSafe(this.app, fullPath);
    }
  }
}
