import {
  Editor,
  FileSystemAdapter,
  MarkdownView,
  normalizePath,
  Plugin,
  TAbstractFile,
  TFile,
  type ListedFiles,
  type MarkdownFileInfo
} from "obsidian";
import CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import CustomAttachmentLocationPluginSettingsTab from "./CustomAttachmentLocationPluginSettingsTab.ts";
import TemplateString from "./TemplateString.ts";
import {
  basename,
  dirname,
  join
} from "node:path/posix";
import moment from "moment";
import { convertAsyncToSync } from "./Async.ts";

export default class CustomAttachmentLocationPlugin extends Plugin {
  private _settings!: CustomAttachmentLocationPluginSettings;
  private useRelativePath: boolean = false;
  private adapter!: FileSystemAdapter;
  private originalAttachmentFolderPath: string = "";

  public get settings(): CustomAttachmentLocationPluginSettings {
    return CustomAttachmentLocationPluginSettings.clone(this._settings);
  }

  public override async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new CustomAttachmentLocationPluginSettingsTab(this));
    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

    console.log("loading plugin");

    this.adapter = this.app.vault.adapter as FileSystemAdapter;
    await this.loadSettings();
    this.backupConfigs();

    this.registerEvent(this.app.workspace.on("editor-paste", convertAsyncToSync(this.handlePaste.bind(this))));
    this.registerEvent(this.app.workspace.on("editor-drop", convertAsyncToSync(this.handleDrop.bind(this))));
    this.registerEvent(this.app.workspace.on("file-open", convertAsyncToSync(this.handleFileOpen.bind(this))));

    this.registerEvent(this.app.vault.on("rename", convertAsyncToSync(this.handleRename.bind(this))));

    this.register(this.restoreConfigs.bind(this));
  }

  public async saveSettings(newSettings: CustomAttachmentLocationPluginSettings): Promise<void> {
    this._settings = CustomAttachmentLocationPluginSettings.clone(newSettings);
    await this.saveData(this._settings);
  }

  private async onLayoutReady(): Promise<void> {
  }

  private async loadSettings(): Promise<void> {
    this._settings = CustomAttachmentLocationPluginSettings.load(await this.loadData());
    this.useRelativePath = this._settings.attachmentFolderPath.startsWith("./");
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

  private getAttachmentFolderPath(mdFileName: string): string {
    const path = new TemplateString(this._settings.attachmentFolderPath).interpolate({
      filename: mdFileName
    });
    return path;
  }

  private getAttachmentFolderFullPath(mdFolderPath: string, mdFileName: string): string {
    let attachmentFolder = "";

    if (this.useRelativePath) {
      attachmentFolder = join(mdFolderPath, this.getAttachmentFolderPath(mdFileName));
    } else {
      attachmentFolder = this.getAttachmentFolderPath(mdFileName);
    }
    return normalizePath(attachmentFolder);
  }

  private getPastedImageFileName(mdFileName: string): string {
    const dateTime = moment().format(this._settings.dateTimeFormat);
    const name = new TemplateString(this._settings.pastedImageFileName).interpolate({
      filename: mdFileName,
      date: dateTime
    });
    return name;
  }

  private async handlePaste(event: ClipboardEvent, editor: Editor, view: MarkdownView | MarkdownFileInfo): Promise<void> {
    console.log("Handle Paste");

    if (!view.file) {
      return;
    }

    const mdFileName = view.file.basename;
    const mdFolderPath: string = dirname(view.file.path);

    const path = this.getAttachmentFolderPath(mdFileName);
    const fullPath = this.getAttachmentFolderFullPath(mdFolderPath, mdFileName);

    this.updateAttachmentFolderConfig(path);

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

        if (!await this.adapter.exists(fullPath)) {
          await this.adapter.mkdir(fullPath);
        }

        for (const entry of pastedImageEntries) {
          const img = await this.blobToArrayBuffer(entry.pasteImage);
          const name = this.getPastedImageFileName(mdFileName);
          const imageFile = await this.app.saveAttachment(name, entry.extension, img);
          insertedMarkdown += this.app.fileManager.generateMarkdownLink(imageFile, view.file.path);
          insertedMarkdown += "\n\n";
        }
      }

      editor.replaceSelection(insertedMarkdown);
    }
  }

  private async handleDrop(_: DragEvent, _2: Editor, view: MarkdownView | MarkdownFileInfo): Promise<void> {
    console.log("Handle Drop");

    if (!view.file) {
      return;
    }

    const mdFileName = view.file.basename;
    const mdFolderPath: string = dirname(view.file.path);

    const path = this.getAttachmentFolderPath(mdFileName);
    const fullPath = this.getAttachmentFolderFullPath(mdFolderPath, mdFileName);

    if (!this.useRelativePath && !await this.adapter.exists(fullPath)) {
      await this.app.vault.createFolder(fullPath);
    }

    this.updateAttachmentFolderConfig(path);
  }

  private handleFileOpen(file: TFile | null): void {
    console.log("Handle File Open");

    if (file == null) {
      console.log("No file open");
      return;
    }

    if (file.extension !== "md") {
      return;
    }

    const mdFileName = file.basename;

    const path = this.getAttachmentFolderPath(mdFileName);

    this.updateAttachmentFolderConfig(path);
  }

  private async handleRename(newFile: TAbstractFile, oldFilePath: string): Promise<void> {
    console.log("Handle Rename");

    if (!(newFile instanceof TFile)) {
      return;
    }

    if (newFile.extension !== "md") {
      return;
    }

    const newName = newFile.basename;

    this.updateAttachmentFolderConfig(this.getAttachmentFolderPath(newName));

    if (!this._settings.autoRenameFolder) {
      return;
    }

    const oldName = basename(oldFilePath, ".md");

    const mdFolderPath: string = dirname(newFile.path);
    const oldMdFolderPath: string = dirname(oldFilePath);
    const oldAttachmentFolderPath: string = this.getAttachmentFolderFullPath(oldMdFolderPath, oldName);
    const newAttachmentFolderPath: string = this.getAttachmentFolderFullPath(mdFolderPath, newName);

    if (await this.adapter.exists(oldAttachmentFolderPath) && (oldAttachmentFolderPath !== newAttachmentFolderPath)) {
      const folder = this.app.vault.getAbstractFileByPath(oldAttachmentFolderPath);

      if (folder == null) {
        return;
      }

      const newAttachmentParentFolderPath: string = dirname(newAttachmentFolderPath);
      if (!(await this.adapter.exists(newAttachmentParentFolderPath))) {
        await this.app.vault.createFolder(newAttachmentParentFolderPath);
      }

      await this.app.fileManager.renameFile(folder, newAttachmentFolderPath);

      const oldAttachmentParentFolderPath: string = dirname(oldAttachmentFolderPath);
      const oldAttachmentParentFolderList: ListedFiles = await this.adapter.list(oldAttachmentParentFolderPath);
      if (oldAttachmentParentFolderList.folders.length === 0 && oldAttachmentParentFolderList.files.length === 0) {
        await this.adapter.rmdir(oldAttachmentParentFolderPath, true);
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
        files.push(basename(link));
      } else {
        continue;
      }

    }

    const attachmentFiles: ListedFiles = await this.adapter.list(newAttachmentFolderPath);
    for (const file of attachmentFiles.files) {
      console.log(file);
      const filePath = file;
      let fileName = basename(filePath);
      if ((files.indexOf(fileName) > -1) && fileName.contains(oldName)) {
        fileName = fileName.replace(oldName, newName);
        const newFilePath = normalizePath(join(newAttachmentFolderPath, fileName));
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

  private blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (): void => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(blob);
    });
  }
}
