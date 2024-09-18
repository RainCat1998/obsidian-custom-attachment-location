import { around } from 'monkey-around';
import {
  Menu,
  PluginSettingTab,
  TAbstractFile,
  TFile,
  TFolder,
  Vault
} from 'obsidian';
import type { MaybePromise } from 'obsidian-dev-utils/Async';
import type {
  ExtendedWrapper,
  GetAvailablePathForAttachmentsExtendedFn
} from 'obsidian-dev-utils/obsidian/AttachmentPath';
import { getAvailablePathForAttachments } from 'obsidian-dev-utils/obsidian/AttachmentPath';
import { isNote } from 'obsidian-dev-utils/obsidian/FileSystem';
import { PluginBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginBase';
import type { RenameDeleteHandlerSettings } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { registerRenameDeleteHandlers } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { createFolderSafe } from 'obsidian-dev-utils/obsidian/Vault';
import {
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';

import {
  collectAttachmentsCurrentFolder,
  collectAttachmentsCurrentNote,
  collectAttachmentsEntireVault,
  collectAttachmentsInFolder
} from './AttachmentCollector.ts';
import { getAttachmentFolderFullPathForPath } from './AttachmentPath.ts';
import CustomAttachmentLocationPluginSettings from './CustomAttachmentLocationPluginSettings.ts';
import CustomAttachmentLocationPluginSettingsTab from './CustomAttachmentLocationPluginSettingsTab.ts';
import { registerPasteDropEventHandlers } from './PasteDropEvent.ts';

type GetAvailablePathFn = Vault['getAvailablePath'];

export default class CustomAttachmentLocationPlugin extends PluginBase<CustomAttachmentLocationPluginSettings> {
  protected override createDefaultPluginSettings(): CustomAttachmentLocationPluginSettings {
    return new CustomAttachmentLocationPluginSettings();
  }

  protected override createPluginSettingsTab(): PluginSettingTab | null {
    return new CustomAttachmentLocationPluginSettingsTab(this);
  }

  protected override onloadComplete(): MaybePromise<void> {
    registerRenameDeleteHandlers(this, () => {
      const settings: Partial<RenameDeleteHandlerSettings> = {
        shouldDeleteEmptyFolders: !this.settings.keepEmptyAttachmentFolders,
        shouldDeleteOrphanAttachments: this.settings.deleteOrphanAttachments,
        shouldRenameAttachmentFiles: this.settings.autoRenameFiles,
        shouldRenameAttachmentFolder: this.settings.autoRenameFolder,
        shouldUpdateFilenameAliases: true,
        shouldUpdateLinks: true
      };
      return settings;
    });

    registerPasteDropEventHandlers(this);

    this.addCommand({
      id: 'collect-attachments-current-note',
      name: 'Collect attachments in current note',
      checkCallback: (checking) => collectAttachmentsCurrentNote(this, checking)
    });

    this.addCommand({
      id: 'collect-attachments-current-folder',
      name: 'Collect attachments in current folder',
      checkCallback: (checking) => collectAttachmentsCurrentFolder(this, checking)
    });

    this.addCommand({
      id: 'collect-attachments-entire-vault',
      name: 'Collect attachments in entire vault',
      callback: () => { collectAttachmentsEntireVault(this); }
    });

    this.registerEvent(this.app.workspace.on('file-menu', this.handleFileMenu.bind(this)));
  }

  protected override onLayoutReady(): void {
    this.register(around(this.app.vault, {
      getAvailablePathForAttachments: (): GetAvailablePathForAttachmentsExtendedFn & ExtendedWrapper => Object.assign(async (filename: string, extension: string, file: TAbstractFile | null, skipFolderCreation?: boolean): Promise<string> =>
        this.getAvailablePathForAttachments(filename, extension, file, skipFolderCreation), {
        isExtended: true as const
      }),
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

  private async getAvailablePathForAttachments(filename: string, extension: string, file: TAbstractFile | null, skipFolderCreation: boolean | undefined): Promise<string> {
    if (!(file instanceof TFile)) {
      return getAvailablePathForAttachments(this.app, filename, extension, file, skipFolderCreation ?? false);
    }

    if (!isNote(file)) {
      return getAvailablePathForAttachments(this.app, filename, extension, file, skipFolderCreation ?? false);
    }

    const attachmentFolderFullPath = await getAttachmentFolderFullPathForPath(this, file.path);

    if (!skipFolderCreation) {
      await createFolderSafe(this.app, attachmentFolderFullPath);
    }
    return this.app.vault.getAvailablePath(join(attachmentFolderFullPath, filename), extension);
  }

  private getAvailablePath(filename: string, extension: string): string {
    let suffixNum = 0;

    for (; ;) {
      const path = makeFileName(suffixNum == 0 ? filename : `${filename}${this.settings.duplicateNameSeparator}${suffixNum.toString()}`, extension);

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
      item.setTitle('Collect attachments in folder')
        .setIcon('download')
        .onClick(() => collectAttachmentsInFolder(this, file));
    });
  }
}
