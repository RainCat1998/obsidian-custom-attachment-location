import {
  Menu,
  PluginSettingTab,
  TAbstractFile,
  TFile,
  TFolder,
  Vault
} from "obsidian";
import CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import CustomAttachmentLocationPluginSettingsTab from "./CustomAttachmentLocationPluginSettingsTab.ts";
import { join } from "obsidian-dev-utils/Path";
import { invokeAsyncSafely, type MaybePromise } from "obsidian-dev-utils/Async";
import {
  getAttachmentFolderFullPathForPath,
  makeFileName
} from "./AttachmentPath.ts";
import { around } from "monkey-around";
import { createFolderSafe } from "obsidian-dev-utils/obsidian/Vault";
import { isNote } from "obsidian-dev-utils/obsidian/TAbstractFile";
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
import { PluginBase } from "obsidian-dev-utils/obsidian/Plugin/PluginBase";

type GetAvailablePathForAttachmentsFn = Vault["getAvailablePathForAttachments"];
type GetAvailablePathFn = Vault["getAvailablePath"];

export default class CustomAttachmentLocationPlugin extends PluginBase<CustomAttachmentLocationPluginSettings> {
  protected override createDefaultPluginSettings(this: void): CustomAttachmentLocationPluginSettings {
    return new CustomAttachmentLocationPluginSettings();
  }

  protected override createPluginSettingsTab(): PluginSettingTab | null {
    return new CustomAttachmentLocationPluginSettingsTab(this);
  }

  protected override onloadComplete(): MaybePromise<void> {
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

  protected override onLayoutReady(): void {
    this.register(around(this.app.vault, {
      getAvailablePathForAttachments: (originalFn: GetAvailablePathForAttachmentsFn): GetAvailablePathForAttachmentsFn => async (filename, extension, file): Promise<string> =>
        this.getAvailablePathForAttachments(filename, extension, file, originalFn),
      getAvailablePath: (): GetAvailablePathFn => (filename, extension): string => this.getAvailablePath(filename, extension)
    }));
  }

  protected override async parseSettings(data: unknown): Promise<CustomAttachmentLocationPluginSettings> {
    const { settings, shouldSave } = CustomAttachmentLocationPluginSettings.load(data);
    if (shouldSave) {
      await this.saveSettings(settings);
    }
    return settings;
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
      const path = makeFileName(suffixNum == 0 ? filename : `${filename}${this.settings.duplicateNameSeparator}${suffixNum}`, extension);

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
