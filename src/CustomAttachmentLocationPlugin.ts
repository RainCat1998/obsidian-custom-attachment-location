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

    if (!(newFile instanceof TFile)) {
      return;
    }

    if (newFile.extension !== "md") {
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
      await createFolderSafe(this.app, newAttachmentParentFolderPath);

      await this.app.fileManager.renameFile(folder, newAttachmentFolderPath);

      const oldAttachmentParentFolderPath: string = dirname(oldAttachmentFolderPath);
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
    if (!(file instanceof TFile)) {
      return;
    }

    if (file.extension.toLowerCase() !== "md") {
      return;
    }

    const fullPath = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(file.path));

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

    if (!isNote(file)) {
      return await originalFn.call(this.app.vault, filename, extension, file);
    }

    const attachmentFolderFullPath = await getAttachmentFolderFullPath(this, createSubstitutionsFromPath(file.path));
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
}
