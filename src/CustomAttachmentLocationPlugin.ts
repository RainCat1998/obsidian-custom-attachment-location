import {
  Menu,
  Plugin,
  TAbstractFile,
  TFile,
  TFolder,
  Vault
} from "obsidian";
import CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import CustomAttachmentLocationPluginSettingsTab from "./CustomAttachmentLocationPluginSettingsTab.ts";
import { posix } from "@jinder/path";
const {
  basename,
  dirname,
  extname,
  join,
  relative
} = posix;
import { convertAsyncToSync } from "./Async.ts";
import {
  getAttachmentFolderFullPath,
  makeFileName
} from "./AttachmentPath.ts";
import { around } from "monkey-around";
import {
  createFolderSafe,
  isNote,
  removeFolderSafe
} from "./Vault.ts";
import { registerPasteDropEventHandlers } from "./PasteDropEvent.ts";
import { createSubstitutionsFromPath } from "./Substitutions.ts";
import {
  collectAttachments,
  collectAttachmentsCurrentFolder,
  collectAttachmentsCurrentNote,
  collectAttachmentsEntireVault,
  collectAttachmentsInFolder
} from "./AttachmentCollector.ts";

type GetAvailablePathForAttachmentsFn = (filename: string, extension: string, file: TAbstractFile) => Promise<string>;
type GetAvailablePathFn = (path: string, extension: string) => string;

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
    registerPasteDropEventHandlers(this);

    this.addCommand({
      id: "collect-attachments-current-note",
      name: "Collect attachments in current note",
      checkCallback: (checking) => collectAttachmentsCurrentNote(this, checking),
    });

    this.addCommand({
      id: "collect-attachments-current-folder",
      name: "Collect attachments in current folder",
      checkCallback: (checking) => collectAttachmentsCurrentFolder(this, checking),
    });

    this.addCommand({
      id: "collect-attachments-entire-vault",
      name: "Collect attachments in entire vault",
      callback: () => collectAttachmentsEntireVault(this),
    });

    this.registerEvent(this.app.workspace.on("file-menu", this.handleFileMenu.bind(this)));
  }

  public async saveSettings(newSettings: CustomAttachmentLocationPluginSettings): Promise<void> {
    this._settings = CustomAttachmentLocationPluginSettings.clone(newSettings);
    await this.saveData(this._settings);
  }

  private onLayoutReady(): void {
    this.register(around(this.app.vault, {
      getAvailablePathForAttachments: (originalFn: GetAvailablePathForAttachmentsFn): GetAvailablePathForAttachmentsFn => async (filename, extension, file): Promise<string> =>
        this.getAvailablePathForAttachments(filename, extension, file, originalFn),
      getAvailablePath: (): GetAvailablePathFn => (filename, extension): string => this.getAvailablePath(filename, extension)
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

    if (!isNote(newFile)) {
      return;
    }

    if (!this._settings.autoRenameFolder) {
      return;
    }

    const newName = newFile.basename;

    const oldName = basename(oldFilePath, extname(oldFilePath));

    const oldAttachmentFolderPath = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(oldFilePath));
    const newAttachmentFolderPath = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(newFile.path));

    let oldAttachmentFolder = this.app.vault.getFolderByPath(oldAttachmentFolderPath);

    if (!oldAttachmentFolder) {
      return;
    }

    const isSameFolder = oldAttachmentFolderPath === newAttachmentFolderPath;

    if (!isSameFolder) {
      await collectAttachments(this, newFile, oldFilePath, (path) => path.startsWith(oldAttachmentFolderPath));

      oldAttachmentFolder = this.app.vault.getFolderByPath(oldAttachmentFolderPath);

      if (!oldAttachmentFolder) {
        return;
      }
    }

    if (isSameFolder && !this._settings.autoRenameFiles) {
      return;
    }

    const children: TAbstractFile[] = [];

    Vault.recurseChildren(oldAttachmentFolder, (child) => {
      children.push(child);
    });

    for (const child of children) {
      const relativePath = relative(oldAttachmentFolderPath, child.path);
      const newChildPath = join(newAttachmentFolderPath, relativePath);
      if (child instanceof TFolder) {
        if (!isSameFolder) {
          await createFolderSafe(this.app, newChildPath);
        }
      } else if (child instanceof TFile) {
        const newChildName = this._settings.autoRenameFiles ? child.basename.replaceAll(oldName, newName) : child.basename;
        const newFilePath = join(dirname(newChildPath), newChildName + "." + child.extension);
        if (child.path !== newFilePath) {
          await this.app.vault.rename(child, newFilePath);
        }
      }
    }

    if (!isSameFolder) {
      await removeFolderSafe(this.app, oldAttachmentFolderPath);
    }
  }

  private async handleDelete(file: TAbstractFile): Promise<void> {
    if (!isNote(file)) {
      return;
    }

    const fullPath = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(file.path));
    await removeFolderSafe(this.app, fullPath, file.path);
  }

  private async getAvailablePathForAttachments(filename: string, extension: string, file: TAbstractFile, originalFn: GetAvailablePathForAttachmentsFn): Promise<string> {
    if (!(file instanceof TFile)) {
      return await originalFn.call(this.app.vault, filename, extension, file);
    }

    if (!isNote(file)) {
      return await originalFn.call(this.app.vault, filename, extension, file);
    }

    const attachmentFolderFullPath = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(file.path));
    await this.createFolder(attachmentFolderFullPath);
    return this.app.vault.getAvailablePath(join(attachmentFolderFullPath, filename), extension);
  }

  private getAvailablePath(filename: string, extension: string): string {
    let suffixNum = 0;

    while (true) {
      const path = makeFileName(suffixNum == 0 ? filename : `${filename}${this._settings.duplicateNameSeparator}${suffixNum}`, extension);

      if (!this.app.vault.getAbstractFileByPathInsensitive(path)) {
        return path;
      }

      suffixNum++;
    }
  }

  private async createFolder(path: string): Promise<void> {
    await createFolderSafe(this.app, path);
    if (!this._settings.keepEmptyAttachmentFolders) {
      return;
    }

    const gitKeepPath = join(path, ".gitkeep");
    if (!await this.app.vault.adapter.exists(gitKeepPath)) {
      await this.app.vault.create(gitKeepPath, "");
    }
  }

  private handleFileMenu(menu: Menu, file: TAbstractFile): void {
    if (!(file instanceof TFolder)) {
      return;
    }

    menu.addItem((item) => {
      item.setTitle("Collect attachments in folder")
        .setIcon("download")
        .onClick(() => collectAttachmentsInFolder(this.app, file));
    });
  }
}
