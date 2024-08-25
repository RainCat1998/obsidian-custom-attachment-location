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
import { join } from "obsidian-dev-utils/Path";
import { invokeAsyncSafely } from "obsidian-dev-utils/Async";
import {
  getAttachmentFolderFullPathForPath,
  makeFileName
} from "./AttachmentPath.ts";
import { around } from "monkey-around";
import {
  createFolderSafe,
  isNote
} from "./Vault.ts";
import { registerPasteDropEventHandlers } from "./PasteDropEvent.ts";
import {
  collectAttachmentsCurrentFolder,
  collectAttachmentsCurrentNote,
  collectAttachmentsEntireVault,
  collectAttachmentsInFolder
} from "./AttachmentCollector.ts";
import {
  handleDelete,
  handleRename
} from "./RenameDeleteHandler.ts";

type GetAvailablePathForAttachmentsFn = Vault["getAvailablePathForAttachments"];
type GetAvailablePathFn = Vault["getAvailablePath"];

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

    this.registerEvent(this.app.vault.on("delete", (file) => invokeAsyncSafely(handleDelete(this, file))));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => invokeAsyncSafely(handleRename(this, file, oldPath))));
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
    await this.saveSettings(this._settings);
  }

  private async getAvailablePathForAttachments(filename: string, extension: string, file: TAbstractFile | null, originalFn: GetAvailablePathForAttachmentsFn): Promise<string> {
    if (!(file instanceof TFile)) {
      return await originalFn.call(this.app.vault, filename, extension, file);
    }

    if (!isNote(file)) {
      return await originalFn.call(this.app.vault, filename, extension, file);
    }

    const attachmentFolderFullPath = await getAttachmentFolderFullPathForPath(this, file.path);
    await createFolderSafe(this.app, attachmentFolderFullPath);
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

  private handleFileMenu(menu: Menu, file: TAbstractFile): void {
    if (!(file instanceof TFolder)) {
      return;
    }

    menu.addItem((item) => {
      item.setTitle("Collect attachments in folder")
        .setIcon("download")
        .onClick(() => collectAttachmentsInFolder(this, file));
    });
  }
}
