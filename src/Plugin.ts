import type {
  App,
  FileManager
} from 'obsidian';
import type {
  ExtendedWrapper,
  GetAvailablePathForAttachmentsExtendedFn
} from 'obsidian-dev-utils/obsidian/AttachmentPath';
import type { RenameDeleteHandlerSettings } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import type {
  ConfigItem,
  SharedFile,
  ShareReceiver
} from 'obsidian-typings/implementations';

import { webUtils } from 'electron';
import moment from 'moment';
import {
  Menu,
  TAbstractFile,
  TFile,
  TFolder,
  Vault
} from 'obsidian';
import { convertAsyncToSync } from 'obsidian-dev-utils/Async';
import { blobToJpegArrayBuffer } from 'obsidian-dev-utils/Blob';
import { getPrototypeOf } from 'obsidian-dev-utils/ObjectUtils';
import { getAvailablePathForAttachments } from 'obsidian-dev-utils/obsidian/AttachmentPath';
import { getAbstractFileOrNull } from 'obsidian-dev-utils/obsidian/FileSystem';
import {
  encodeUrl,
  generateMarkdownLink,
  testAngleBrackets,
  testWikilink
} from 'obsidian-dev-utils/obsidian/Link';
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
  getGeneratedAttachmentFileName
} from './AttachmentPath.ts';
import { AttachmentRenameMode } from './PluginSettings.ts';
import { PluginSettingsManager } from './PluginSettingsManager.ts';
import { PluginSettingsTab } from './PluginSettingsTab.ts';
import { PrismComponent } from './PrismComponent.ts';
import { Substitutions } from './Substitutions.ts';

type GenerateMarkdownLinkFn = FileManager['generateMarkdownLink'];
type GetAvailablePathFn = Vault['getAvailablePath'];
type GetAvailablePathForAttachmentsFn = Vault['getAvailablePathForAttachments'];
type GetConfigFn = Vault['getConfig'];
type GetPathForFileFn = typeof webUtils['getPathForFile'];
type SaveAttachmentFn = App['saveAttachment'];

const PASTED_IMAGE_NAME_REG_EXP = /Pasted image (?<Timestamp>\d{14})/;
const PASTED_IMAGE_DATE_FORMAT = 'YYYYMMDDHHmmss';
const THRESHOLD_IN_SECONDS = 10;

interface FileEx {
  path: string;
}

type ImportFilesFn = ShareReceiver['importFiles'];

export class Plugin extends PluginBase<PluginTypes> {
  private currentAttachmentFolderPath: null | string = null;
  private getAvailablePathForAttachmentsOriginal: GetAvailablePathForAttachmentsFn | null = null;
  private lastOpenFilePath: null | string = null;
  private readonly pathMarkdownUrlMap = new Map<string, string>();

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
      getAvailablePathForAttachments: (next: GetAvailablePathForAttachmentsFn): ExtendedWrapper & GetAvailablePathForAttachmentsExtendedFn => {
        this.getAvailablePathForAttachmentsOriginal = next.bind(this.app.vault);
        const extendedWrapper: ExtendedWrapper = {
          isExtended: true as const
        };
        return Object.assign(this.getAvailablePathForAttachments.bind(this), extendedWrapper) as ExtendedWrapper & GetAvailablePathForAttachmentsExtendedFn;
      },
      getConfig: (next: GetConfigFn): GetConfigFn => {
        return (name: ConfigItem): unknown => {
          return this.getConfig(next, name);
        };
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (webUtils) {
      registerPatch(this, webUtils, {
        getPathForFile: (next: GetPathForFileFn): GetPathForFileFn => {
          return (file: File): string => {
            return this.getPathForFile(file, next);
          };
        }
      });
    }

    registerPatch(this, this.app.fileManager, {
      generateMarkdownLink: (next: GenerateMarkdownLinkFn): GenerateMarkdownLinkFn => {
        return (file: TFile, sourcePath: string, subpath?: string, alias?: string): string => {
          return this.generateMarkdownLink(next, file, sourcePath, subpath, alias);
        };
      }
    });

    registerPatch(this, getPrototypeOf(this.app.shareReceiver), {
      importFiles: (next: ImportFilesFn): ImportFilesFn => {
        return (files: SharedFile[]): Promise<void> => {
          return this.importFiles(next, files);
        };
      }
    });

    if (compare(this.settings.warningVersion, '8.1.0') < 0) {
      await alert({
        app: this.app,
        message: createFragment((f) => {
          f.appendText('In plugin version 8.1.0, some token names changed. Please update your tokens accordingly. Refer to the ');
          f.createEl('a', {
            href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
            text: 'documentation'
          });
          f.appendText(' for more information.');
        })
      });

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
        shouldUpdateFileNameAliases: true
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
      saveAttachment: (): SaveAttachmentFn => {
        return (name, extension, data): Promise<TFile> => {
          return this.saveAttachment(name, extension, data);
        };
      }
    });
    this.addChild(new PrismComponent());

    this.registerEvent(this.app.workspace.on('file-open', convertAsyncToSync(this.handleFileOpen.bind(this))));
    this.registerEvent(this.app.vault.on('rename', convertAsyncToSync(this.handleRename.bind(this))));
  }

  private generateMarkdownLink(next: GenerateMarkdownLinkFn, file: TFile, sourcePath: string, subpath?: string, alias?: string): string {
    let defaultLink = next.call(this.app.fileManager, file, sourcePath, subpath, alias);

    if (!this.settings.markdownUrlFormat) {
      return defaultLink;
    }

    const markdownUrl = this.pathMarkdownUrlMap.get(file.path);

    if (!markdownUrl) {
      return defaultLink;
    }

    if (testWikilink(defaultLink)) {
      defaultLink = generateMarkdownLink({
        app: this.app,
        isWikilink: false,
        originalLink: defaultLink,
        sourcePathOrFile: sourcePath,
        targetPathOrFile: file
      });
    }

    if (testAngleBrackets(defaultLink)) {
      return defaultLink.replace(/\]\(<.+?>\)/, `](<${markdownUrl}>)`);
    }

    return defaultLink.replace(/\]\(.+?\)/, `](${encodeUrl(markdownUrl)})`);
  }

  private getAvailablePath(attachmentFileName: string, attachmentExtension: string): string {
    let suffixNum = 0;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const path = makeFileName(
        suffixNum === 0 ? attachmentFileName : `${attachmentFileName}${this.settings.duplicateNameSeparator}${suffixNum.toString()}`,
        attachmentExtension
      );

      if (!getAbstractFileOrNull(this.app, path, true)) {
        return path;
      }

      suffixNum++;
    }
  }

  private async getAvailablePathForAttachments(
    attachmentFileName: string,
    attachmentExtension: string,
    noteFile: null | TFile,
    skipMissingAttachmentFolderCreation: boolean | undefined,
    attachmentFileContent?: ArrayBuffer
  ): Promise<string> {
    if (noteFile && this.settings.isPathIgnored(noteFile.path) && this.getAvailablePathForAttachmentsOriginal) {
      return this.getAvailablePathForAttachmentsOriginal(attachmentFileName, attachmentExtension, noteFile);
    }

    let attachmentPath: string;
    if (!noteFile || !isNoteEx(this, noteFile)) {
      attachmentPath = await getAvailablePathForAttachments(this.app, attachmentFileName, attachmentExtension, noteFile, true);
    } else {
      const attachmentFolderFullPath = await getAttachmentFolderFullPathForPath(
        this,
        noteFile.path,
        makeFileName(attachmentFileName, attachmentExtension),
        attachmentFileContent
      );
      attachmentPath = this.app.vault.getAvailablePath(join(attachmentFolderFullPath, attachmentFileName), attachmentExtension);
    }

    if (!skipMissingAttachmentFolderCreation) {
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

  private getConfig(next: GetConfigFn, name: ConfigItem): unknown {
    if (name !== 'attachmentFolderPath' || this.currentAttachmentFolderPath === null) {
      return next.call(this.app.vault, name);
    }

    return this.currentAttachmentFolderPath;
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

  private async handleFileOpen(file: null | TFile): Promise<void> {
    if (file === null || this.settings.isPathIgnored(file.path)) {
      this.currentAttachmentFolderPath = null;
      this.lastOpenFilePath = null;
      return;
    }

    if (file.path === this.lastOpenFilePath) {
      return;
    }

    this.lastOpenFilePath = file.path;
    this.currentAttachmentFolderPath = await getAttachmentFolderFullPathForPath(this, file.path, 'dummy.pdf');
  }

  private async handleRename(): Promise<void> {
    await this.handleFileOpen(this.app.workspace.getActiveFile());
  }

  private async importFiles(next: ImportFilesFn, files: SharedFile[]): Promise<void> {
    for (const file of files) {
      const fileUri = window.Capacitor.convertFileSrc(file.uri);
      const response = await fetch(fileUri);
      const attachmentFileContent = await response.arrayBuffer();
      const substitutions = new Substitutions({
        app: this.app,
        attachmentFileContent,
        noteFilePath: this.app.workspace.getActiveFile()?.path ?? '',
        originalAttachmentFileName: file.name
      });
      const attachmentFileName = await getGeneratedAttachmentFileName(this, substitutions);
      file.name = makeFileName(attachmentFileName, substitutions.originalAttachmentFileExtension);
    }

    return next.call(this.app.shareReceiver, files);
  }

  private async saveAttachment(
    attachmentFileName: string,
    attachmentFileExtension: string,
    attachmentFileContent: ArrayBuffer
  ): Promise<TFile> {
    const activeNoteFile = this.app.workspace.getActiveFile();
    if (!activeNoteFile || this.settings.isPathIgnored(activeNoteFile.path)) {
      return await this.saveAttachmentCore(attachmentFileName, attachmentFileExtension, attachmentFileContent);
    }

    let isPastedImage = false;
    const match = PASTED_IMAGE_NAME_REG_EXP.exec(attachmentFileName);
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

    if (isPastedImage && attachmentFileExtension === 'png' && this.settings.shouldConvertPastedImagesToJpeg) {
      attachmentFileExtension = 'jpg';
      attachmentFileContent = await blobToJpegArrayBuffer(new Blob([attachmentFileContent], { type: 'image/png' }), this.settings.jpegQuality);
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
      attachmentFileName = await getGeneratedAttachmentFileName(
        this,
        new Substitutions({
          app: this.app,
          attachmentFileContent,
          noteFilePath: activeNoteFile.path,
          originalAttachmentFileName: makeFileName(attachmentFileName, attachmentFileExtension)
        })
      );
    }

    const attachmentFile = await this.saveAttachmentCore(attachmentFileName, attachmentFileExtension, attachmentFileContent);
    if (this.settings.markdownUrlFormat) {
      const markdownUrl = await new Substitutions({
        app: this.app,
        attachmentFileContent,
        generatedAttachmentFileName: attachmentFile.name,
        generatedAttachmentFilePath: attachmentFile.path,
        noteFilePath: activeNoteFile.path,
        originalAttachmentFileName: makeFileName(attachmentFileName, attachmentFileExtension)
      }).fillTemplate(this.settings.markdownUrlFormat);
      this.pathMarkdownUrlMap.set(attachmentFile.path, markdownUrl);
    } else {
      this.pathMarkdownUrlMap.delete(attachmentFile.path);
    }
    return attachmentFile;
  }

  private async saveAttachmentCore(
    attachmentFileName: string,
    attachmentFileExtension: string,
    attachmentFileContent: ArrayBuffer
  ): Promise<TFile> {
    const noteFile = this.app.workspace.getActiveFile();
    const attachmentPath = await this.getAvailablePathForAttachments(
      attachmentFileName,
      attachmentFileExtension,
      noteFile,
      false,
      attachmentFileContent
    );
    return await this.app.vault.createBinary(attachmentPath, attachmentFileContent);
  }
}
