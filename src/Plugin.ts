import type { App } from 'obsidian';
import type {
  ExtendedWrapper,
  GetAvailablePathForAttachmentsExtendedFn
} from 'obsidian-dev-utils/obsidian/AttachmentPath';
import type { RenameDeleteHandlerSettings } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';

import { webUtils } from 'electron';
import moment from 'moment';
import {
  Menu,
  TAbstractFile,
  TFile,
  TFolder,
  Vault
} from 'obsidian';
import { blobToJpegArrayBuffer } from 'obsidian-dev-utils/Blob';
import { getAvailablePathForAttachments } from 'obsidian-dev-utils/obsidian/AttachmentPath';
import { getAbstractFileOrNull } from 'obsidian-dev-utils/obsidian/FileSystem';
import { alert } from 'obsidian-dev-utils/obsidian/Modals/Alert';
import { registerPatch } from 'obsidian-dev-utils/obsidian/MonkeyAround';
import { PluginBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginBase';
import {
  EmptyAttachmentFolderBehavior,
  registerRenameDeleteHandlers
} from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { createFolderSafe } from 'obsidian-dev-utils/obsidian/Vault';
import {
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';
import { parentFolderPath } from 'obsidian-typings/implementations';
import { compare } from 'semver';

import type { PluginTypes } from './PluginTypes.ts';

import {
  collectAttachmentsCurrentFolder,
  collectAttachmentsCurrentNote,
  collectAttachmentsEntireVault,
  collectAttachmentsInFolder,
  isNoteEx
} from './AttachmentCollector.ts';
import {
  getAttachmentFolderFullPathForPath,
  getPastedFileName
} from './AttachmentPath.ts';
import { AttachmentRenameMode } from './PluginSettings.ts';
import { PluginSettingsManager } from './PluginSettingsManager.ts';
import { PluginSettingsTab } from './PluginSettingsTab.ts';
import { PrismComponent } from './PrismComponent.ts';
import { Substitutions } from './Substitutions.ts';

type GetAvailablePathFn = Vault['getAvailablePath'];
type GetPathForFileFn = typeof webUtils['getPathForFile'];
type SaveAttachmentFn = App['saveAttachment'];

const PASTED_IMAGE_NAME_REG_EXP = /Pasted image (?<Timestamp>\d{14})/;
const PASTED_IMAGE_DATE_FORMAT = 'YYYYMMDDHHmmss';
const THRESHOLD_IN_SECONDS = 10;

interface FileEx {
  path: string;
}

export class Plugin extends PluginBase<PluginTypes> {
  protected override createSettingsManager(): PluginSettingsManager {
    return new PluginSettingsManager(this);
  }

  protected override createSettingsTab(): null | PluginSettingsTab {
    return new PluginSettingsTab(this);
  }

  protected override async onLayoutReady(): Promise<void> {
    await super.onLayoutReady();
    registerPatch(this, this.app.vault, {
      getAvailablePath: (): GetAvailablePathFn => this.getAvailablePath.bind(this),
      getAvailablePathForAttachments: (): ExtendedWrapper & GetAvailablePathForAttachmentsExtendedFn => {
        const extendedWrapper: ExtendedWrapper = {
          isExtended: true as const
        };
        return Object.assign(this.getAvailablePathForAttachments.bind(this), extendedWrapper) as ExtendedWrapper & GetAvailablePathForAttachmentsExtendedFn;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (webUtils) {
      registerPatch(this, webUtils, {
        getPathForFile: (next: GetPathForFileFn): GetPathForFileFn => (file: File): string => this.getPathForFile(file, next)
      });
    }

    if (compare(this.settings.warningVersion, '7.0.0') < 0) {
      if (this.settings.customTokensStr) {
        await alert({
          app: this.app,
          message: createFragment((f) => {
            f.appendText('In plugin version 7.0.0, the format for custom tokens has changed. Please update your custom tokens accordingly. Refer to the ');
            f.createEl('a', {
              href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens',
              text: 'documentation'
            });
            f.appendText(' for more information.');
          })
        });
      }

      await this.settingsManager.editAndSave((settings) => {
        settings.warningVersion = this.manifest.version;
      });
    }
  }

  protected override async onloadImpl(): Promise<void> {
    await super.onloadImpl();
    registerRenameDeleteHandlers(this, () => {
      const settings: Partial<RenameDeleteHandlerSettings> = {
        emptyAttachmentFolderBehavior: this.settings.emptyAttachmentFolderBehavior,
        isNote: (path) => isNoteEx(this, path),
        isPathIgnored: (path) => this.settings.isPathIgnored(path),
        shouldHandleDeletions: this.settings.shouldDeleteOrphanAttachments,
        shouldHandleRenames: true,
        shouldRenameAttachmentFiles: this.settings.shouldRenameAttachmentFiles,
        shouldRenameAttachmentFolder: this.settings.shouldRenameAttachmentFolder,
        shouldUpdateFilenameAliases: true
      };
      return settings;
    });

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

    registerPatch(this, this.app, {
      saveAttachment: (next: SaveAttachmentFn) => (name, extension, data): Promise<TFile> => this.saveAttachment(next, name, extension, data)
    });
    this.addChild(new PrismComponent());
  }

  private getAvailablePath(filename: string, extension: string): string {
    let suffixNum = 0;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
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
    if (!file || !isNoteEx(this, file)) {
      attachmentPath = await getAvailablePathForAttachments(this.app, filename, extension, file, true);
    } else {
      const attachmentFolderFullPath = await getAttachmentFolderFullPathForPath(this, file.path, makeFileName(filename, extension));
      attachmentPath = this.app.vault.getAvailablePath(join(attachmentFolderFullPath, filename), extension);
    }

    if (!skipFolderCreation) {
      const folderPath = parentFolderPath(attachmentPath);
      if (!await this.app.vault.exists(folderPath)) {
        await createFolderSafe(this.app, folderPath);
        if (this.settings.emptyAttachmentFolderBehavior === EmptyAttachmentFolderBehavior.Keep) {
          await this.app.vault.create(join(folderPath, '.gitkeep'), '');
        }
      }
    }

    return attachmentPath;
  }

  private getPathForFile(file: File, next: GetPathForFileFn): string {
    const fileEx = file as Partial<FileEx>;
    if (fileEx.path) {
      return fileEx.path;
    }
    return next(file);
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

  private async saveAttachment(next: SaveAttachmentFn, name: string, extension: string, data: ArrayBuffer): Promise<TFile> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile || this.settings.isPathIgnored(activeFile.path)) {
      return next.call(this.app, name, extension, data);
    }

    let isPastedImage = false;
    const match = PASTED_IMAGE_NAME_REG_EXP.exec(name);
    if (match) {
      const timestampString = match.groups?.['Timestamp'];
      if (timestampString) {
        const parsedDate = moment(timestampString, PASTED_IMAGE_DATE_FORMAT);
        if (parsedDate.isValid()) {
          if (moment().diff(parsedDate, 'seconds') < THRESHOLD_IN_SECONDS) {
            isPastedImage = true;
          }
        }
      }
    }

    if (isPastedImage && extension === 'png' && this.settings.shouldConvertPastedImagesToJpeg) {
      extension = 'jpg';
      data = await blobToJpegArrayBuffer(new Blob([data], { type: 'image/png' }), this.settings.jpegQuality);
    }

    let shouldRename = false;

    switch (this.settings.attachmentRenameMode) {
      case AttachmentRenameMode.All:
        shouldRename = true;
        break;
      case AttachmentRenameMode.None:
        break;
      case AttachmentRenameMode.OnlyPastedImages:
        shouldRename = isPastedImage;
        break;
      default:
        throw new Error('Invalid attachment rename mode');
    }

    if (shouldRename) {
      name = await getPastedFileName(this, new Substitutions(this.app, activeFile.path, makeFileName(name, extension)));
    }

    return await next.call(this.app, name, extension, data);
  }
}
