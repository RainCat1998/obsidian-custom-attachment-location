import {
  Editor,
  FileSystemAdapter,
  MarkdownView,
  normalizePath,
  Plugin,
  TAbstractFile,
  TFile,
  TFolder,
  type ListedFiles,
  type MarkdownFileInfo
} from "obsidian";
import CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import CustomAttachmentLocationPluginSettingsTab from "./CustomAttachmentLocationPluginSettingsTab.ts";

import { posix } from "@jinder/path";

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

  /**
   * example:
   *   /dir/${date:YYYY}/${date:MM}/${filename} -> /^\/dir\/\d{4}\/\d{2}\/targetFileName$/
   * @param template raw path contains meta vars
   * @param targetFileName
   * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to regex
   */
  private interpolateToDigitRegex(template: string, targetFileName: string): RegExp {
    const dateRegExp = /\$\{date:(.*?)\}/g;
    // match ${date:date_format} pattern
    let regExpString = template.replace(dateRegExp, (_, p1: string) => {
      // replace ${date} with \d{x} regex
      return `\\d{${p1.length}}`;
    });

    const filenameRegExp = /\$\{filename\}/g;
    // match ${filename} pattern
    regExpString = regExpString.replace(filenameRegExp, targetFileName);

    return new RegExp(`^${regExpString}$`);
  }

  /**
   * example:
   *   /dir1/${date:YYYY}/${date:MM}/${filename} -> /dir1/2024/06/targetFileName
   * @param template template path contains meta vars
   * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to string path, using now time
   */
  private interpolateDateToString(template: string, targetFileName: string): string {
    // match ${date:date_format} pattern
    const dateRegExp = /\$\{date:(.*?)\}/g;

    let newPath = template.replace(dateRegExp, (_, dateFormat: string) => {
      // use moment to reformat date string
      const date = moment().format(dateFormat);
      return date;
    });

    const filenameRegExp = /\$\{filename\}/g;
    // match ${filename} pattern
    newPath = newPath.replace(filenameRegExp, targetFileName);

    return newPath;
  }

  private async getEarliestAttachmentFolder(attachmentFolderTemplate: string, targetFileName: string): Promise<string> {
    const targetRegex = this.interpolateToDigitRegex(attachmentFolderTemplate, targetFileName);
    const folders = this.app.vault.getAllLoadedFiles()
      .filter((f: TAbstractFile) => f instanceof TFolder)
      .filter((f: TAbstractFile) => targetRegex.test(f.path));

    const folderStats = await Promise.all(folders.map(async (folder: TFolder) => {
      const stat = await this.app.vault.adapter.stat(posix.join(this.app.vault.adapter.getBasePath(), folder.path));
      return {
        path: folder.path,
        ctime: stat?.ctime ?? 0
      };
    }));

    if (folderStats.length > 0) {
      // create time ascending
      return folderStats.sort((a, b) => a.ctime - b.ctime).map(f => f.path)[0]!;
    } else {
      return this.interpolateDateToString(attachmentFolderTemplate, targetFileName);
    }

  }

  private async getAttachmentFolderPath(mdFileName: string): Promise<string> {
    return await this.getEarliestAttachmentFolder(this.settings.attachmentFolderPath, mdFileName);
  }

  private async getAttachmentFolderFullPath(mdFolderPath: string, mdFileName: string): Promise<string> {
    let attachmentFolder = "";

    if (this.useRelativePath) {
      attachmentFolder = posix.join(mdFolderPath, await this.getAttachmentFolderPath(mdFileName));
    } else {
      attachmentFolder = await this.getAttachmentFolderPath(mdFileName);
    }
    return normalizePath(attachmentFolder);
  }

  private getPastedImageFileName(mdFileName: string): string {
    return this.interpolateDateToString(this.settings.pastedImageFileName, mdFileName);
  }

  private async handlePaste(event: ClipboardEvent, editor: Editor, view: MarkdownView | MarkdownFileInfo): Promise<void> {
    console.log("Handle Paste");

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

        const mdFileName = view.file.basename;
        const mdFolderPath: string = posix.dirname(view.file.path);
        const path = await this.getAttachmentFolderPath(mdFileName);
        const fullPath = await this.getAttachmentFolderFullPath(mdFolderPath, mdFileName);
        this.updateAttachmentFolderConfig(path);

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
    const mdFolderPath: string = posix.dirname(view.file.path);

    const path = await this.getAttachmentFolderPath(mdFileName);
    const fullPath = await this.getAttachmentFolderFullPath(mdFolderPath, mdFileName);

    if (!this.useRelativePath && !await this.adapter.exists(fullPath)) {
      await this.app.vault.createFolder(fullPath);
    }

    this.updateAttachmentFolderConfig(path);
  }

  private async handleFileOpen(file: TFile | null): Promise<void> {
    console.log("Handle File Open");

    if (file == null) {
      console.log("No file open");
      return;
    }

    if (file.extension !== "md") {
      return;
    }

    const mdFileName = file.basename;

    const path = await this.getAttachmentFolderPath(mdFileName);

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

    const oldName = posix.basename(oldFilePath, ".md");

    const oldMdFolderPath: string = posix.dirname(oldFilePath);
    const oldAttachmentFolderPath: string = await this.getAttachmentFolderFullPath(oldMdFolderPath, oldName);
    const newAttachmentFolderPath: string = posix.join(posix.dirname(oldAttachmentFolderPath), newName);

    // why this ?
    // hints: after rename seems attachmentFolderConfig will be reset
    this.updateAttachmentFolderConfig(await this.getAttachmentFolderPath(newName));

    if (!this.settings.autoRenameFolder) {
      return;
    }

    if (await this.adapter.exists(oldAttachmentFolderPath) && (oldAttachmentFolderPath !== newAttachmentFolderPath)) {
      const folder = this.app.vault.getAbstractFileByPath(oldAttachmentFolderPath);

      if (folder == null) {
        return;
      }

      const newAttachmentParentFolderPath: string = posix.dirname(newAttachmentFolderPath);
      if (!(await this.adapter.exists(newAttachmentParentFolderPath))) {
        await this.app.vault.createFolder(newAttachmentParentFolderPath);
      }

      await this.app.fileManager.renameFile(folder, newAttachmentFolderPath);

      const oldAttachmentParentFolderPath: string = posix.dirname(oldAttachmentFolderPath);
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
        files.push(posix.basename(link));
      } else {
        continue;
      }

    }

    const attachmentFiles: ListedFiles = await this.adapter.list(newAttachmentFolderPath);
    for (const file of attachmentFiles.files) {
      console.log(file);
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

  private blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (): void => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(blob);
    });
  }
}
