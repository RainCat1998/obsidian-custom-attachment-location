import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting, moment, normalizePath, TAbstractFile, TFolder, FileSystemAdapter, ListedFiles, TFile, Stat} from 'obsidian';
import * as Path from 'path';

interface CustomAttachmentLocationSettings {
    attachmentFolderPath: string;
    pastedImageFileName: string;
    dateTimeFormat: string;
    autoRenameFolder: boolean;
    autoRenameFiles: boolean;
}

const DEFAULT_SETTINGS: CustomAttachmentLocationSettings = {
    attachmentFolderPath: './assets/${filename}',
    pastedImageFileName: 'image-${date}',
    dateTimeFormat: 'YYYYMMDDHHmmssSSS',
    autoRenameFolder: true,
    autoRenameFiles: false
}

let originalSettings = {
    attachmentFolderPath: ''
};

const blobToArrayBuffer = (blob: Blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsArrayBuffer(blob)
    })
}


class TemplateString extends String {
    interpolate(params: Object) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        return new Function(...names, `return \`${this}\`;`)(...vals);
    }
}

export default class CustomAttachmentLocation extends Plugin {
    settings: CustomAttachmentLocationSettings;
    useRelativePath: boolean = false;
    adapter: FileSystemAdapter;

    async onload() {
        console.log('loading plugin');

        this.adapter = this.app.vault.adapter as FileSystemAdapter;
        await this.loadSettings();
        this.backupConfigs();

        this.addSettingTab(new CustomAttachmentLocationSettingTab(this.app, this));
        /*
            bind this pointer to handlePaste
            this.registerEvent(this.app.workspace.on('editor-paste', this.handlePaste));
        */
        this.registerEvent(this.app.workspace.on('editor-paste', this.handlePaste.bind(this)));
        this.registerEvent(this.app.workspace.on('editor-drop', this.handleDrop.bind(this)));
        this.registerEvent(this.app.workspace.on('file-open', this.handleFileOpen.bind(this)));

        this.registerEvent(this.app.vault.on('rename', this.handleRename.bind(this)));


    }

    onunload() {
        console.log('unloading plugin');
        this.restoreConfigs();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        if (this.settings.attachmentFolderPath.startsWith('./'))
            this.useRelativePath = true;
        else
            this.useRelativePath = false;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    backupConfigs() {
        //@ts-ignore
        originalSettings.attachmentFolderPath = this.app.vault.getConfig('attachmentFolderPath');
    }

    restoreConfigs() {
        //@ts-ignore
        this.app.vault.setConfig('attachmentFolderPath', originalSettings.attachmentFolderPath);
    }

    updateAttachmentFolderConfig(path: string) {
        //@ts-ignore
        this.app.vault.setConfig('attachmentFolderPath', path);
    }

    /**
     * exmpale:
     *   /dir/${date:YYYY}/${date:MM}/${filename} -> /^\/dir\/\d{4}\/\d{2}\/targetFileName$/
     * @param template raw path contains meta vars
     * @param targetFileName 
     * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to regex
     */
    interpolateToDigitRegex(template: string, targetFileName: string) {
        const dateRegex = /\$\{date:(.*?)\}/g;
        // match ${date:date_format} pattern
        let regexString = template.replace(dateRegex, (match, p1) => {
            // replace ${date} with \d{x} regex
            return `\\d{${p1.length}}`;
        });

        const filenameRegx = /\$\{filename\}/g;
        // match ${filename} pattern
        regexString = regexString.replace(filenameRegx, (match, p1) => {
            return targetFileName;
        });

        return new RegExp(`^${regexString}$`);
    }

    /**
     * exmpale:
     *   /dir1/${date:YYYY}/${date:MM}/${filename} -> /dir1/2024/06/targetFileName
     * @param template template path contains meta vars
     * @returns interpolate vars begin with ${date:**} (moment.js format) and ${filename} to string path, using now time
     */
    interpolateDateToString(template: string, targetFileName: string): string {
        // match ${date:date_format} pattern
        const dateRegex = /\$\{date:(.*?)\}/g;

        let newPath = template.replace(dateRegex, (match, dateFormat) => {
            // use moment to reformat date string
            const date = moment().format(dateFormat);
            return date;
        });

        const filenameRegx = /\$\{filename\}/g;
        // match ${filename} pattern
        newPath = newPath.replace(filenameRegx, (match, p1) => {
            return targetFileName;
        });

        return newPath;
    }

    async getEarliestAttachmentFolder(attachmentFolderTemplate: string, targetFileName: string) {
        const targetRegex = this.interpolateToDigitRegex(attachmentFolderTemplate, targetFileName)
        let folders = this.app.vault.getAllLoadedFiles()
        .filter((f: TAbstractFile) => f instanceof TFolder)
        .filter((f: TAbstractFile) => targetRegex.test(f.path));

        const folderStats = await Promise.all(folders.map(async (folder: TFolder) => {
            const stat = await this.app.vault.adapter.stat(folder.path);
            return {
                path: folder.path,
                mtime: stat.mtime,
                ctime: stat.ctime
            };
        }));

        if (folderStats.length > 0) {
            // creat time asceding
            return folderStats.sort((a, b) => a.ctime - b.ctime).map(f => f.path)[0];
        } else {
            return this.interpolateDateToString(attachmentFolderTemplate, targetFileName);
        }
    
    }

    async getAttachmentFolderPath(mdFileName: string) {
        return await this.getEarliestAttachmentFolder(this.settings.attachmentFolderPath, mdFileName);
    }

    async getAttachmentFolderFullPath(mdFolderPath: string, mdFileName: string) {
        let attachmentFolder = '';

        if (this.useRelativePath)
            attachmentFolder = Path.join(mdFolderPath, await this.getAttachmentFolderPath(mdFileName));
        else {
            attachmentFolder = await this.getAttachmentFolderPath(mdFileName);
        }
        return normalizePath(attachmentFolder);
    }

    getPastedImageFileName(mdFileName: string) {
        return this.interpolateDateToString(this.settings.pastedImageFileName, mdFileName);
    }


    async handlePaste(event: ClipboardEvent, editor: Editor, view: MarkdownView) {
        console.log('Handle Paste');

        let clipBoardData = event.clipboardData;
        if (clipBoardData == null || clipBoardData.items == null)
            return;
        let clipBoardItems = clipBoardData.items;
        if (!clipBoardData.getData('text/plain')) {
            for (let i in clipBoardItems) {
                if (!clipBoardItems.hasOwnProperty(i))
                    continue;
                let item = clipBoardItems[i];
                if (item.kind !== 'file')
                    continue;
                if (!(item.type === 'image/png' || item.type === 'image/jpeg'))
                    continue;

                let pasteImage = item.getAsFile();
                if (!pasteImage)
                    continue;

                let extension = '';
                item.type === 'image/png' ? extension = 'png' : item.type === 'image/jpeg' && (extension = 'jpeg');

                event.preventDefault();

                let mdFileName = view.file.basename;
                let mdFolderPath: string = Path.dirname(view.file.path);
        
                let path = await this.getAttachmentFolderPath(mdFileName);
                let fullPath = await this.getAttachmentFolderFullPath(mdFolderPath, mdFileName);
        
                /* 
                sample
                this.app.vault.setConfig('attachmentFolderPath', `./assets/${filename}`);
                */
                this.updateAttachmentFolderConfig(path);

                //if folder not exist, mkdir first.
                if (!await this.adapter.exists(fullPath))
                    await this.adapter.mkdir(fullPath);

                let img = await blobToArrayBuffer(pasteImage);
                
                /* 
                sample
                let name = 'image-' + moment().format('YYYYMMDDHHmmssSSS');
                */
                let name = this.getPastedImageFileName(mdFileName);

                //@ts-ignore
                let imageFile = await this.app.saveAttachment(name, extension, img);
                let markdownLink = this.app.fileManager.generateMarkdownLink(imageFile, view.file.path);
                markdownLink += '\n\n';
                editor.replaceSelection(markdownLink);
            }
        }
    }

    async handleDrop(event: DragEvent, editor: Editor, view: MarkdownView) {
        console.log('Handle Drop');

        let mdFileName = view.file.basename;
        let mdFolderPath: string = Path.dirname(view.file.path);

        let path = await this.getAttachmentFolderPath(mdFileName);
        let fullPath = await this.getAttachmentFolderFullPath(mdFolderPath, mdFileName);

        if (!this.useRelativePath && !await this.adapter.exists(fullPath))
            await this.app.vault.createFolder(fullPath);

        this.updateAttachmentFolderConfig(path);
    }

    async handleFileOpen(file: TFile | null) {
        console.log('Handle File Open');


        if (file == null) {
            console.log("No file open");
            return;
        }

        if (file.extension !== 'md')
            return;

        let mdFileName = file.basename;

        let path = await this.getAttachmentFolderPath(mdFileName);

        this.updateAttachmentFolderConfig(path);
    }

    async handleRename(newFile: TFile, oldFilePath: string) {
        console.log('Handle Rename');

        if (newFile.extension !== 'md')
            return;

        let newName = newFile.basename;

        let oldName = Path.basename(oldFilePath, '.md');

        let mdFolderPath: string = Path.dirname(newFile.path);
        let oldMdFolderPath: string = Path.dirname(oldFilePath);
        let oldAttachmentFolderPath: string = await this.getAttachmentFolderFullPath(oldMdFolderPath, oldName);
        let newAttachmentFolderPath: string = Path.join(Path.dirname(oldAttachmentFolderPath), newName)

        // why this ? 
        // hints: after rename seems attachmentFolderConfig will be reset
        this.updateAttachmentFolderConfig(await this.getAttachmentFolderPath(newName));

        if (!this.settings.autoRenameFolder) {
            return;
        }   

        //check if old attachment folder exists and is necessary to rename Folder
        if (await this.adapter.exists(oldAttachmentFolderPath) && (oldAttachmentFolderPath !== newAttachmentFolderPath)) {
            let tfolder = this.app.vault.getAbstractFileByPath(oldAttachmentFolderPath);

            if (tfolder == null)
                return;

            let newAttachmentParentFolderPath: string = Path.dirname(newAttachmentFolderPath)
            if (!(await this.adapter.exists(newAttachmentParentFolderPath))) {
                await this.app.vault.createFolder(newAttachmentParentFolderPath);
            }

            await this.app.fileManager.renameFile(tfolder, newAttachmentFolderPath);

            let oldAttachmentParentFolderPath: string = Path.dirname(oldAttachmentFolderPath)
            let oldAttachmentParentFolderList: ListedFiles = await this.adapter.list(oldAttachmentParentFolderPath);
            if (oldAttachmentParentFolderList.folders.length === 0 && oldAttachmentParentFolderList.files.length === 0) {
                await this.adapter.rmdir(oldAttachmentParentFolderPath, true);
            }
        }

        //if autoRenameFiles is off
        if (!this.settings.autoRenameFiles)
            return;

        let embeds = this.app.metadataCache.getCache(newFile.path)?.embeds;
        if (!embeds)
            return;

        let files: string[] = [];

        for (let embed of embeds) {
            let link = embed.link;
            if (link.endsWith('.png') || link.endsWith('jpeg'))
                files.push(Path.basename(link));
            else
                continue;

        }

        let attachmentFiles: ListedFiles = await this.adapter.list(newAttachmentFolderPath);
        for (let file of attachmentFiles.files) {
            console.log(file);
            let filePath = file;
            let fileName = Path.basename(filePath);
            if ((files.indexOf(fileName) > -1) && fileName.contains(oldName)) {
                fileName = fileName.replace(oldName, newName);
                let newFilePath = normalizePath(Path.join(newAttachmentFolderPath, fileName));
                let tfile = this.app.vault.getAbstractFileByPath(filePath);
                if (tfile == null)
                    continue;
                await this.app.fileManager.renameFile(tfile, newFilePath);
            }
            else
                continue;
        }
    }
}

class CustomAttachmentLocationSettingTab extends PluginSettingTab {
    plugin: CustomAttachmentLocation;

    constructor(app: App, plugin: CustomAttachmentLocation) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Custom Attachment Location' });

        let el = new Setting(containerEl)
            .setName('Location for New Attachments')
            .setDesc('Start with "./" to use relative path. Available variables: ${filename}.(NOTE: DO NOT start with "/" or end with "/". )')
            .addText(text => text
                .setPlaceholder('./assets/${filename}')
                .setValue(this.plugin.settings.attachmentFolderPath)
                .onChange(async (value: string) => {
                    console.log('attachmentFolder: ' + value);
                    value = normalizePath(value);
                    console.log('normalized attachmentFolder: ' + value);

                    this.plugin.settings.attachmentFolderPath = value;
                    if (value.startsWith('./'))
                        this.plugin.useRelativePath = true;
                    else
                        this.plugin.useRelativePath = false;
                    await this.plugin.saveSettings();
                }));
        el.controlEl.addEventListener('change', (() => { this.display(); }));


        new Setting(containerEl)
            .setName('Pasted Image Name')
            .setDesc('Available variables: ${filename}, ${date}.')
            .addText(text => text
                .setPlaceholder('image-${date}')
                .setValue(this.plugin.settings.pastedImageFileName)
                .onChange(async (value: string) => {
                    console.log('pastedImageFileName: ' + value);
                    this.plugin.settings.pastedImageFileName = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Date Format')
            .setDesc('YYYYMMDDHHmmssSSS')
            .addMomentFormat(text => text
                .setDefaultFormat('YYYYMMDDHHmmssSSS')
                .setValue(this.plugin.settings.dateTimeFormat)
                .onChange(async (value: string) => {
                    console.log('dateTimeFormat: ' + value);
                    this.plugin.settings.dateTimeFormat = value || 'YYYYMMDDHHmmssSSS';
                    await this.plugin.saveSettings();
                }));


        new Setting(containerEl)
            .setName('Automatically rename attachment folder')
            .setDesc('When renaming md files, automatically rename attachment folder if folder name contains "${filename}".')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoRenameFolder)
                .onChange(async (value: boolean) => {
                    this.plugin.settings.autoRenameFolder = value;
                    this.display();
                    await this.plugin.saveSettings();
                }));

        if (this.plugin.settings.autoRenameFolder)
            new Setting(containerEl)
                .setName('Automatically rename attachment files')
                .setDesc('When renaming md files, automatically rename attachment files if file name contains "${filename}".')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.autoRenameFiles)
                    .onChange(async (value: boolean) => {
                        this.plugin.settings.autoRenameFiles = value;
                        await this.plugin.saveSettings();
                    }));
    }
}
