import type { MaybePromise } from 'obsidian-dev-utils/Async';
import type {
  ExtendedWrapper,
  GetAvailablePathForAttachmentsExtendedFn
} from 'obsidian-dev-utils/obsidian/AttachmentPath';
import type { RenameDeleteHandlerSettings } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';

import { webUtils } from 'electron';
import { around } from 'monkey-around';
import {
  Menu,
  PluginSettingTab,
  TAbstractFile,
  TFile,
  TFolder,
  Vault
} from 'obsidian';
import { getAvailablePathForAttachments } from 'obsidian-dev-utils/obsidian/AttachmentPath';
import {
  getAbstractFileOrNull,
  isNote
} from 'obsidian-dev-utils/obsidian/FileSystem';
import { PluginBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginBase';
import { registerRenameDeleteHandlers } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { createFolderSafe } from 'obsidian-dev-utils/obsidian/Vault';
import {
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';
import { parentFolderPath } from 'obsidian-typings/implementations';

import {
  collectAttachmentsCurrentFolder,
  collectAttachmentsCurrentNote,
  collectAttachmentsEntireVault,
  collectAttachmentsInFolder
} from './AttachmentCollector.ts';
import { getAttachmentFolderFullPathForPath } from './AttachmentPath.ts';
import { CustomAttachmentLocationPluginSettings } from './CustomAttachmentLocationPluginSettings.ts';
import { CustomAttachmentLocationPluginSettingsTab } from './CustomAttachmentLocationPluginSettingsTab.ts';
import { registerPasteDropEventHandlers } from './PasteDropEvent.ts';

type GetAvailablePathFn = Vault['getAvailablePath'];
type GetPathForFileFn = typeof webUtils['getPathForFile'];

export class CustomAttachmentLocationPlugin extends PluginBase<CustomAttachmentLocationPluginSettings> {
  protected override createPluginSettings(data: unknown): CustomAttachmentLocationPluginSettings {
    return new CustomAttachmentLocationPluginSettings(data);
  }

  protected override createPluginSettingsTab(): null | PluginSettingTab {
    return new CustomAttachmentLocationPluginSettingsTab(this);
  }

  protected override onLayoutReady(): void {
    this.register(around(this.app.vault, {
      getAvailablePath: (): GetAvailablePathFn => this.getAvailablePath.bind(this),
      getAvailablePathForAttachments: (): ExtendedWrapper & GetAvailablePathForAttachmentsExtendedFn => {
        const extendedWrapper: ExtendedWrapper = {
          isExtended: true as const
        };
        return Object.assign(this.getAvailablePathForAttachments.bind(this), extendedWrapper) as ExtendedWrapper & GetAvailablePathForAttachmentsExtendedFn;
      }
    }));

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (webUtils) {
      this.register(around(webUtils, {
        getPathForFile: (next: GetPathForFileFn): GetPathForFileFn => (file: File): string => this.getPathForFile(file, next)
      }));
    }
  }

  protected override onloadComplete(): MaybePromise<void> {
    registerRenameDeleteHandlers(this, () => {
      const settings: Partial<RenameDeleteHandlerSettings> = {
        shouldDeleteEmptyFolders: !this.settings.shouldKeepEmptyAttachmentFolders,
        shouldHandleDeletions: this.settings.shouldDeleteOrphanAttachments,
        shouldHandleRenames: true,
        shouldRenameAttachmentFiles: this.settings.shouldRenameAttachmentFiles,
        shouldRenameAttachmentFolder: this.settings.shouldRenameAttachmentFolder,
        shouldUpdateFilenameAliases: true
      };
      return settings;
    });

    registerPasteDropEventHandlers(this);

    this.addCommand({
      checkCallback: (checking) => collectAttachmentsCurrentNote(this, checking),
      id: 'collect-attachments-current-note',
      name: 'Collect attachments in current note'
    });

    this.addCommand({
      checkCallback: (checking) => collectAttachmentsCurrentFolder(this, checking),
      id: 'collect-attachments-current-folder',
      name: 'Collect attachments in current folder'
    });

    this.addCommand({
      callback: () => {
        collectAttachmentsEntireVault(this);
      },
      id: 'collect-attachments-entire-vault',
      name: 'Collect attachments in entire vault'
    });

    this.registerEvent(this.app.workspace.on('file-menu', this.handleFileMenu.bind(this)));
  }

  private getAvailablePath(filename: string, extension: string): string {
    let suffixNum = 0;

    for (;;) {
      const path = makeFileName(suffixNum === 0 ? filename : `${filename}${this.settings.duplicateNameSeparator}${suffixNum.toString()}`, extension);

      if (!getAbstractFileOrNull(this.app, path, true)) {
        return path;
      }

      suffixNum++;
    }
  }

  private async getAvailablePathForAttachments(
    filename: string,
    extension: string,
    file: null | TFile,
    skipFolderCreation: boolean | undefined
  ): Promise<string> {
    let attachmentPath: string;
    if (!file || !isNote(this.app, file)) {
      attachmentPath = await getAvailablePathForAttachments(this.app, filename, extension, file, true);
    } else {
      const attachmentFolderFullPath = await getAttachmentFolderFullPathForPath(this, file.path, makeFileName(filename, extension));
      attachmentPath = this.app.vault.getAvailablePath(join(attachmentFolderFullPath, filename), extension);
    }

    if (!skipFolderCreation) {
      const folderPath = parentFolderPath(attachmentPath);
      if (!await this.app.vault.exists(folderPath)) {
        await createFolderSafe(this.app, folderPath);
        if (this.settings.shouldKeepEmptyAttachmentFolders) {
          await this.app.vault.create(join(folderPath, '.gitkeep'), '');
        }
      }
    }

    return attachmentPath;
  }

  private getPathForFile(file: File, next: GetPathForFileFn): string {
    return file.path || next(file);
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
