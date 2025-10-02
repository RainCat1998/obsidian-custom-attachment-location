import type {
  App,
  DataWriteOptions,
  FileManager,
  FileStats,
  WorkspaceLeaf
} from 'obsidian';
import type {
  AttachmentPathContext,
  GetAvailablePathForAttachmentsExtendedFnOptions,
  GetAvailablePathForAttachmentsFnExtended
} from 'obsidian-dev-utils/obsidian/AttachmentPath';
import type { TranslationsMap } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import type { RenameDeleteHandlerSettings } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import type {
  ClipboardManager,
  ImportedAttachment
} from 'obsidian-typings';
import type {
  ConfigItem,
  SharedFile,
  ShareReceiver
} from 'obsidian-typings/implementations';

import { webUtils } from 'electron';
import moment from 'moment';
import {
  CapacitorAdapter,
  FileSystemAdapter,
  MarkdownView,
  Menu,
  MenuItem,
  TAbstractFile,
  TFile,
  TFolder,
  Vault
} from 'obsidian';
import { convertAsyncToSync } from 'obsidian-dev-utils/Async';
import { blobToJpegArrayBuffer } from 'obsidian-dev-utils/Blob';
import {
  getPrototypeOf,
  normalizeOptionalProperties,
  removeUndefinedProperties
} from 'obsidian-dev-utils/ObjectUtils';
import {
  DUMMY_PATH,
  getAvailablePathForAttachments
} from 'obsidian-dev-utils/obsidian/AttachmentPath';
import {
  getAbstractFileOrNull,
  getFileOrNull,
  getPath
} from 'obsidian-dev-utils/obsidian/FileSystem';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import {
  encodeUrl,
  generateMarkdownLink,
  LinkStyle,
  testAngleBrackets,
  testWikilink
} from 'obsidian-dev-utils/obsidian/Link';
import { registerPatch } from 'obsidian-dev-utils/obsidian/MonkeyAround';
import { PluginBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginBase';
import {
  EmptyAttachmentFolderBehavior,
  registerRenameDeleteHandlers
} from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { createFolderSafe } from 'obsidian-dev-utils/obsidian/Vault';
import {
  basename,
  dirname,
  extname,
  join,
  makeFileName
} from 'obsidian-dev-utils/Path';
import { trimStart } from 'obsidian-dev-utils/String';
import {
  parentFolderPath,
  ViewType
} from 'obsidian-typings/implementations';

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
  getGeneratedAttachmentFileBaseName
} from './AttachmentPath.ts';
import { translationsMap } from './i18n/locales/translationsMap.ts';
import { getImageSize } from './Image.ts';
import { AttachmentRenameMode } from './PluginSettings.ts';
import { PluginSettingsManager } from './PluginSettingsManager.ts';
import { PluginSettingsTab } from './PluginSettingsTab.ts';
import { PrismComponent } from './PrismComponent.ts';
import { Substitutions } from './Substitutions.ts';
import { ActionContext } from './TokenEvaluatorContext.ts';

type ArrayBufferFn = File['arrayBuffer'];
interface FileEx {
  path: string;
}
type GenerateMarkdownLinkFn = FileManager['generateMarkdownLink'];
type GetAvailablePathFn = Vault['getAvailablePath'];
type GetAvailablePathForAttachmentsFn = Vault['getAvailablePathForAttachments'];
type GetConfigFn = Vault['getConfig'];
type GetPathForFileFn = typeof webUtils['getPathForFile'];
type ImportFilesFn = ShareReceiver['importFiles'];
type InsertFilesFn = ClipboardManager['insertFiles'];

type SaveAttachmentFn = App['saveAttachment'];

const PASTED_IMAGE_NAME_REG_EXP = /Pasted image (?<Timestamp>\d{14})/;
const PASTED_IMAGE_DATE_FORMAT = 'YYYYMMDDHHmmss';
const THRESHOLD_IN_SECONDS = 10;
const IMPORT_FILES_PREFIX = '__IMPORT_FILES__';

export class Plugin extends PluginBase<PluginTypes> {
  private readonly arrayBufferFileStatMap = new WeakMap<ArrayBuffer, FileStats>();
  private currentAttachmentFolderPath: null | string = null;
  private readonly getAvailablePathForAttachmentsOriginal: GetAvailablePathForAttachmentsFn | null = null;
  private readonly imageAttachmentSizeMap = new Map<string, string>();
  private isMarkdownViewPatched = false;
  private lastOpenFilePath: null | string = null;
  private readonly pathMarkdownUrlMap = new Map<string, string>();

  public replaceSpecialCharacters(str: string): string {
    if (!this.settings.specialCharacters) {
      return str;
    }

    str = str.replace(this.settings.specialCharactersRegExp, this.settings.specialCharactersReplacement);
    return str;
  }

  protected override createSettingsManager(): PluginSettingsManager {
    return new PluginSettingsManager(this);
  }

  protected override createSettingsTab(): null | PluginSettingsTab {
    return new PluginSettingsTab(this);
  }

  protected override createTranslationsMap(): TranslationsMap<PluginTypes> {
    return translationsMap;
  }

  protected override async onLayoutReady(): Promise<void> {
    await super.onLayoutReady();
    Substitutions.registerCustomTokens(this.settings.customTokensStr);
    await this.settingsManager.loadFromFile(false);

    registerPatch(this, this.app.vault, {
      getAvailablePath: (): GetAvailablePathFn => this.getAvailablePath.bind(this),
      getAvailablePathForAttachments: (next: GetAvailablePathForAttachmentsFn): GetAvailablePathForAttachmentsFnExtended => {
        const that = this;

        return Object.assign(nextCopy, {
          extended: this.getAvailablePathForAttachments.bind(this)
        }) as GetAvailablePathForAttachmentsFnExtended;

        function nextCopy(filename: string, extension: string, file: null | TFile): Promise<string> {
          return next.call(that.app.vault, filename, extension, file);
        }
      },
      getConfig: (next: GetConfigFn): GetConfigFn => {
        return (name: ConfigItem): unknown => {
          return this.getConfig(next, name);
        };
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Actually not available on some platforms.
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

    this.registerPopupDocumentDomEvent('change', this.handleInputFileChange.bind(this), { capture: true });

    await this.handleActiveLeafChange(this.app.workspace.getLeavesOfType(ViewType.Markdown)[0] ?? null);

    if (!this.isMarkdownViewPatched) {
      this.registerEvent(this.app.workspace.on('active-leaf-change', convertAsyncToSync(this.handleActiveLeafChange.bind(this))));
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
      name: t(($) => $.commands.collectAttachmentsCurrentNote)
    });

    this.addCommand({
      checkCallback: (checking) => collectAttachmentsCurrentFolder(this, checking),
      id: 'collect-attachments-current-folder',
      name: t(($) => $.commands.collectAttachmentsCurrentFolder)
    });

    this.addCommand({
      callback: () => {
        collectAttachmentsEntireVault(this);
      },
      id: 'collect-attachments-entire-vault',
      name: t(($) => $.commands.collectAttachmentsEntireVault)
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

    this.registerEvent(this.app.workspace.on('receive-text-menu', this.handleReceiveTextMenu.bind(this)));
    this.registerEvent(this.app.workspace.on('receive-files-menu', this.handleReceiveFilesMenu.bind(this)));
  }

  private async fileArrayBuffer(next: ArrayBufferFn, file: File): Promise<ArrayBuffer> {
    const arrayBuffer = await next.call(file);
    if (this.app.vault.adapter instanceof FileSystemAdapter) {
      const path = webUtils.getPathForFile(file);
      if (await this.setFileStat(arrayBuffer, path)) {
        return arrayBuffer;
      }
    }

    this.arrayBufferFileStatMap.set(arrayBuffer, {
      ctime: 0,
      mtime: file.lastModified,
      size: file.size
    });
    return arrayBuffer;
  }

  private generateMarkdownLink(next: GenerateMarkdownLinkFn, file: TFile, sourcePath: string, subpath?: string, alias?: string): string {
    if (alias === undefined) {
      const imageSize = this.imageAttachmentSizeMap.get(file.path);
      if (imageSize) {
        this.imageAttachmentSizeMap.delete(file.path);
        alias = imageSize;
      }
    }
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
        linkStyle: LinkStyle.Markdown,
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Easiest infinite loop.
    while (true) {
      const path = makeFileName(
        suffixNum === 0 ? attachmentFileName : `${attachmentFileName}${this.settings.duplicateNameSeparator}${String(suffixNum)}`,
        attachmentExtension
      );

      if (!getAbstractFileOrNull(this.app, path, true)) {
        return path;
      }

      suffixNum++;
    }
  }

  private async getAvailablePathForAttachments(options: GetAvailablePathForAttachmentsExtendedFnOptions): Promise<string> {
    const {
      attachmentFileExtension,
      notePathOrFile,
      shouldSkipDuplicateCheck,
      shouldSkipMissingAttachmentFolderCreation
    } = options;
    let {
      attachmentFileBaseName,
      attachmentFileContent,
      attachmentFileStat,
      shouldSkipGeneratedAttachmentFileName
    } = options;

    if (attachmentFileBaseName === DUMMY_PATH) {
      attachmentFileContent ??= new ArrayBuffer(0);
      const now = Math.trunc(Date.now());
      attachmentFileStat ??= {
        ctime: now,
        mtime: now,
        size: 0
      };
    }

    const noteFile = getFileOrNull(this.app, notePathOrFile);
    const noteFilePath = notePathOrFile ? getPath(this.app, notePathOrFile) : undefined;
    const oldNoteFilePath = options.oldNotePathOrFile ? getPath(this.app, options.oldNotePathOrFile) : undefined;

    if (attachmentFileBaseName.startsWith(IMPORT_FILES_PREFIX)) {
      attachmentFileBaseName = trimStart(attachmentFileBaseName, IMPORT_FILES_PREFIX);
      shouldSkipGeneratedAttachmentFileName = true;
    }
    if (noteFile && this.settings.isPathIgnored(noteFile.path) && this.getAvailablePathForAttachmentsOriginal) {
      return this.getAvailablePathForAttachmentsOriginal(attachmentFileBaseName, attachmentFileExtension, noteFile);
    }

    let attachmentPath: string;
    if (!noteFilePath || !isNoteEx(this, noteFilePath)) {
      attachmentPath = await getAvailablePathForAttachments({
        app: this.app,
        attachmentFileBaseName,
        attachmentFileExtension,
        notePathOrFile,
        shouldSkipDuplicateCheck: shouldSkipDuplicateCheck ?? false,
        shouldSkipMissingAttachmentFolderCreation: shouldSkipMissingAttachmentFolderCreation ?? true
      });
    } else {
      const attachmentFileName = makeFileName(attachmentFileBaseName, attachmentFileExtension);
      const attachmentFolderFullPath = await getAttachmentFolderFullPathForPath(
        this,
        options.context as string as ActionContext,
        noteFilePath,
        attachmentFileName,
        oldNoteFilePath,
        attachmentFileContent,
        attachmentFileStat
      );
      let generatedAttachmentFileName: string;
      if (shouldSkipGeneratedAttachmentFileName) {
        generatedAttachmentFileName = attachmentFileName;
      } else {
        const generatedAttachmentFileBaseName = await getGeneratedAttachmentFileBaseName(
          this,
          new Substitutions({
            actionContext: options.context as string as ActionContext,
            attachmentFileContent,
            attachmentFileStat,
            noteFilePath,
            oldNoteFilePath,
            originalAttachmentFileName: attachmentFileName,
            plugin: this
          })
        );
        generatedAttachmentFileName = makeFileName(generatedAttachmentFileBaseName, attachmentFileExtension);
      }
      const generatedAttachmentFileNamePath = join(attachmentFolderFullPath, generatedAttachmentFileName);
      if (shouldSkipDuplicateCheck) {
        attachmentPath = generatedAttachmentFileNamePath;
      } else {
        const dir = dirname(generatedAttachmentFileNamePath);
        const generatedAttachmentFileNameBaseName = basename(generatedAttachmentFileNamePath, attachmentFileExtension ? `.${attachmentFileExtension}` : '');
        attachmentPath = this.app.vault.getAvailablePath(join(dir, generatedAttachmentFileNameBaseName), attachmentFileExtension);
      }
    }

    if (!shouldSkipMissingAttachmentFolderCreation) {
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

  private async handleActiveLeafChange(leaf: null | WorkspaceLeaf): Promise<void> {
    if (this.isMarkdownViewPatched) {
      return;
    }

    if (!leaf) {
      return;
    }

    if (leaf.view.getViewType() !== ViewType.Markdown) {
      return;
    }

    await leaf.loadIfDeferred();

    const markdownView = leaf.view as MarkdownView;

    const that = this;
    registerPatch(this, getPrototypeOf(markdownView.editMode.clipboardManager), {
      insertFiles: (next: InsertFilesFn): InsertFilesFn => {
        return function insertFilesPatched(this: ClipboardManager, importedAttachments: ImportedAttachment[]): Promise<void> {
          return that.insertFiles(next, this, importedAttachments);
        };
      }
    });

    this.isMarkdownViewPatched = true;
  }

  private handleFileMenu(menu: Menu, file: TAbstractFile): void {
    if (!(file instanceof TFolder)) {
      return;
    }

    menu.addItem((item) => {
      item.setTitle(t(($) => $.menuItems.collectAttachmentsInFolder))
        .setIcon('download')
        .onClick(() => collectAttachmentsInFolder(this, file, this.abortSignal));
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
    this.currentAttachmentFolderPath = await getAttachmentFolderFullPathForPath(this, ActionContext.OpenFile, file.path, DUMMY_PATH);
  }

  private handleInputFileChange(evt: Event): void {
    if (!(evt.target instanceof HTMLInputElement)) {
      return;
    }

    if (evt.target.type !== 'file') {
      return;
    }

    const that = this;
    for (const file of evt.target.files ?? []) {
      registerPatch(this, file, {
        arrayBuffer: (next: ArrayBufferFn): ArrayBufferFn => {
          return function arrayBufferPatched(this: File): Promise<ArrayBuffer> {
            return that.fileArrayBuffer(next, this);
          };
        }
      });
    }
  }

  private handleReceiveFilesMenu(menu: Menu, attachmentFiles: TFile[]): void {
    this.handleReceiveMenuItemClick(menu, (noteFile) => {
      const linkTexts = attachmentFiles.map((attachmentFile) => this.app.fileManager.generateMarkdownLink(attachmentFile, noteFile.path));
      return linkTexts.join('\n');
    });
  }

  private handleReceiveMenuItemClick(menu: Menu, prepareTextFn: (noteFile: TFile) => string): void {
    const app = this.app;
    const menuItem = menu.items.find((item) => item instanceof MenuItem && !!item.iconEl.querySelector('.lucide-file')) as MenuItem | undefined;
    if (menuItem) {
      menuItem.callback = callback;
    }

    function callback(): void {
      const markdownView = app.workspace.getActiveViewOfType(MarkdownView);
      if (!markdownView?.file) {
        return;
      }

      const text = prepareTextFn(markdownView.file);
      markdownView.editor.replaceSelection(text);
    }
  }

  private handleReceiveTextMenu(menu: Menu, text: string): void {
    this.handleReceiveMenuItemClick(menu, () => text);
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
        actionContext: ActionContext.ImportFiles,
        attachmentFileContent,
        noteFilePath: this.app.workspace.getActiveFile()?.path ?? '',
        originalAttachmentFileName: file.name,
        plugin: this
      });
      const attachmentFileBaseName = await getGeneratedAttachmentFileBaseName(this, substitutions);
      const attachmentFileExtension = extname(file.name).slice(1);
      file.name = IMPORT_FILES_PREFIX + makeFileName(attachmentFileBaseName, attachmentFileExtension);
    }

    return next.call(this.app.shareReceiver, files);
  }

  private async insertFiles(next: InsertFilesFn, clipboardManager: ClipboardManager, importedAttachments: ImportedAttachment[]): Promise<void> {
    for (const importedAttachment of importedAttachments) {
      const arrayBuffer = await importedAttachment.data;
      await this.setFileStat(arrayBuffer, importedAttachment.filepath);
    }
    return next.call(clipboardManager, importedAttachments);
  }

  private async saveAttachment(
    attachmentFileBaseName: string,
    attachmentFileExtension: string,
    attachmentFileContent: ArrayBuffer
  ): Promise<TFile> {
    const activeNoteFile = this.app.workspace.getActiveFile();
    if (!activeNoteFile || this.settings.isPathIgnored(activeNoteFile.path)) {
      return await this.saveAttachmentCore(attachmentFileBaseName, attachmentFileExtension, attachmentFileContent);
    }

    let isPastedImage = false;
    const match = PASTED_IMAGE_NAME_REG_EXP.exec(attachmentFileBaseName);
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
      attachmentFileBaseName = await getGeneratedAttachmentFileBaseName(
        this,
        new Substitutions({
          actionContext: ActionContext.SaveAttachment,
          attachmentFileContent,
          attachmentFileStat: this.arrayBufferFileStatMap.get(attachmentFileContent),
          noteFilePath: activeNoteFile.path,
          originalAttachmentFileName: makeFileName(attachmentFileBaseName, attachmentFileExtension),
          plugin: this
        })
      );
    }

    const attachmentFile = await this.saveAttachmentCore(attachmentFileBaseName, attachmentFileExtension, attachmentFileContent);
    if (this.settings.markdownUrlFormat) {
      const markdownUrl = await new Substitutions({
        actionContext: ActionContext.SaveAttachment,
        attachmentFileContent,
        attachmentFileStat: this.arrayBufferFileStatMap.get(attachmentFileContent),
        generatedAttachmentFileName: attachmentFile.name,
        generatedAttachmentFilePath: attachmentFile.path,
        noteFilePath: activeNoteFile.path,
        originalAttachmentFileName: makeFileName(attachmentFileBaseName, attachmentFileExtension),
        plugin: this
      }).fillTemplate(this.settings.markdownUrlFormat);
      this.pathMarkdownUrlMap.set(attachmentFile.path, markdownUrl);
    } else {
      this.pathMarkdownUrlMap.delete(attachmentFile.path);
    }
    return attachmentFile;
  }

  private async saveAttachmentCore(
    attachmentFileBaseName: string,
    attachmentFileExtension: string,
    attachmentFileContent: ArrayBuffer
  ): Promise<TFile> {
    const noteFile = this.app.workspace.getActiveFile();
    const attachmentFileStat = this.arrayBufferFileStatMap.get(attachmentFileContent);

    const attachmentPath = await this.getAvailablePathForAttachments({
      attachmentFileBaseName,
      attachmentFileContent,
      attachmentFileExtension,
      attachmentFileStat,
      context: ActionContext.SaveAttachment as string as AttachmentPathContext,
      notePathOrFile: noteFile,
      shouldSkipDuplicateCheck: false,
      shouldSkipGeneratedAttachmentFileName: true,
      shouldSkipMissingAttachmentFolderCreation: false
    });

    const imageSize = await getImageSize(this, attachmentFileExtension, attachmentFileContent);
    if (imageSize !== null) {
      this.imageAttachmentSizeMap.set(attachmentPath, imageSize);
    }

    return await this.app.vault.createBinary(
      attachmentPath,
      attachmentFileContent,
      removeUndefinedProperties(normalizeOptionalProperties<DataWriteOptions>({
        ctime: attachmentFileStat?.ctime ? Math.trunc(attachmentFileStat.ctime) : undefined,
        mtime: attachmentFileStat?.mtime ? Math.trunc(attachmentFileStat.mtime) : undefined
      }))
    );
  }

  private async setFileStat(arrayBuffer: ArrayBuffer, filePath: string): Promise<boolean> {
    if (!filePath) {
      return false;
    }

    if (this.app.vault.adapter instanceof FileSystemAdapter) {
      const stats = await this.app.vault.adapter.fsPromises.stat(filePath);
      this.arrayBufferFileStatMap.set(arrayBuffer, {
        ctime: stats.ctimeMs,
        mtime: stats.mtimeMs,
        size: stats.size
      });
      return true;
    }

    if (this.app.vault.adapter instanceof CapacitorAdapter) {
      const stats = await this.app.vault.adapter.fs.stat(filePath);
      this.arrayBufferFileStatMap.set(arrayBuffer, {
        ctime: stats.ctime ?? 0,
        mtime: stats.mtime ?? 0,
        size: arrayBuffer.byteLength
      });
      return true;
    }

    return false;
  }
}
