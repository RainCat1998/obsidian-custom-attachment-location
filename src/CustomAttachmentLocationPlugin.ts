import {
  normalizePath,
  Notice,
  Plugin,
  TAbstractFile,
  TFile,
  TFolder,
  type ListedFiles,
} from "obsidian";
import CustomAttachmentLocationPluginSettings from "./CustomAttachmentLocationPluginSettings.ts";
import CustomAttachmentLocationPluginSettingsTab from "./CustomAttachmentLocationPluginSettingsTab.ts";
import { posix } from "@jinder/path";
const {
  basename,
  dirname,
  extname,
  join
} = posix;
import { convertAsyncToSync } from "./Async.ts";
import {
  getAttachmentFolderFullPath,
  makeFileName
} from "./AttachmentPath.ts";
import { around } from "monkey-around";
import {
  createFolderSafe,
  isNote
} from "./Vault.ts";
import { registerPasteDropEventHandlers } from "./PasteDropEvent.ts";
import { createSubstitutionsFromPath } from "./Substitutions.ts";

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

    const newName = newFile.basename;

    const oldName = basename(oldFilePath, extname(oldFilePath));

    const oldAttachmentFolderPath: string = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(oldFilePath));
    const newAttachmentFolderPath: string = join(dirname(oldAttachmentFolderPath), newName);

    if (!this._settings.autoRenameFolder) {
      return;
    }

    if (await this.app.vault.adapter.exists(oldAttachmentFolderPath) && (oldAttachmentFolderPath !== newAttachmentFolderPath)) {
      const folder = this.app.vault.getAbstractFileByPath(oldAttachmentFolderPath);

      if (folder == null) {
        return;
      }

      const newAttachmentParentFolderPath: string = dirname(newAttachmentFolderPath);
      await this.createFolder(newAttachmentParentFolderPath);

      await this.app.fileManager.renameFile(folder, newAttachmentFolderPath);

      await this.safeRemoveFolder(oldAttachmentFolderPath);
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

    const attachmentFiles: ListedFiles = await this.app.vault.adapter.list(newAttachmentFolderPath);
    for (const file of attachmentFiles.files) {
      console.debug(file);
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

  private async handleDelete(file: TAbstractFile): Promise<void> {
    if (!isNote(file)) {
      return;
    }

    const fullPath = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(file.path));
    await this.safeRemoveFolder(fullPath, file.path);
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

  private async safeRemoveFolder(folderPath: string, removedNotePath?: string): Promise<boolean> {
    const folder = this.app.vault.getFolderByPath(folderPath);

    if (!folder) {
      return false;
    }

    let canRemove = true;

    for (const child of folder.children) {
      if (child instanceof TFile) {
        const backlinks = this.app.metadataCache.getBacklinksForFile(child);
        if (removedNotePath) {
          backlinks.removeKey(removedNotePath);
        }
        if (backlinks.count() !== 0) {
          new Notice(`Attachment ${child.path} is still used by other notes. It will not be deleted.`);
          canRemove = false;
        } else {
          try {
            await this.app.vault.delete(child);
          } catch (e) {
            if (await this.app.vault.exists(child)) {
              console.error(`Failed to delete ${child.path}`, e);
              canRemove = false;
            }
          }
        }
      } else if (child instanceof TFolder) {
        canRemove &&= await this.safeRemoveFolder(child.path, removedNotePath);
      }
    }

    if (canRemove) {
      try {
        await this.app.vault.delete(folder, true);
      } catch (e) {
        if (await this.app.vault.exists(folder)) {
          console.error(`Failed to delete ${folder.path}`, e);
          canRemove = false;
        }
      }
    }

    return canRemove;
  }
}
