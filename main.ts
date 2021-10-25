import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface CustomAttachmentLocationSettings {
    attachmentFolder: string;
    pastedImageFileName: string;
    dateTimeFormat: string;
}

const DEFAULT_SETTINGS: CustomAttachmentLocationSettings = {
    attachmentFolder: "assets/${filename}",
    pastedImageFileName: "image-${date}",
    dateTimeFormat: "YYYYMMDDHHmmssSSS"
}

let originalSettings = {
    newLinkFormat: "",
    attachmentFolderPath: ""
};

const blobToArrayBuffer = (blob: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsArrayBuffer(blob)
    })
}


class TemplateString extends String{
    interpolate(params: Object) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        return new Function(...names, `return \`${this}\`;`)(...vals);
    }
}


export default class CustomAttachmentLocation extends Plugin {
    settings: CustomAttachmentLocationSettings;

    async onload() {
        console.log('loading plugin');

        await this.loadSettings();
        this.backupSettings();

        this.addSettingTab(new CustomAttachmentLocationSettingTab(this.app, this));
        this.registerEvent(this.app.workspace.on('editor-paste', this.handlePaste));
    }

    onunload() {
        console.log('unloading plugin');
        this.restoreSettings();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    backupSettings(){
        //@ts-ignore
        originalSettings.newLinkFormat = this.app.vault.getConfig("newLinkFormat");
        //@ts-ignore
        originalSettings.attachmentFolderPath = this.app.vault.getConfig("attachmentFolderPath");
    }

    restoreSettings(){
        //@ts-ignore
        this.app.vault.setConfig("newLinkFormat", originalSettings.newLinkFormat);
        //@ts-ignore
        this.app.vault.setConfig("attachmentFolderPath", originalSettings.attachmentFolderPath);
    }

    async handlePaste(event: ClipboardEvent, editor: Editor, view: MarkdownView){
        console.log("Handle Paste");
        
        //@ts-ignore
        let settings = app.plugins.getPlugin('obsidian-custom-attachment-location-plugin').settings
        let mdFileName = view.file.basename;

        let path = new TemplateString("./" + settings.attachmentFolder).interpolate({
            filename: mdFileName
        });

        //@ts-ignore
        app.vault.setConfig("newLinkFormat", "relative");

        //@ts-ignore
        app.vault.setConfig("attachmentFolderPath", path);
        // app.vault.setConfig("attachmentFolderPath", `./assets/${filename}`);

        let clipBoardData = event.clipboardData;
        let clipBoardItems = clipBoardData.items;
        if(!clipBoardData.getData("text/plain")){
            for(let i in clipBoardItems){
                if(!clipBoardItems.hasOwnProperty(i))
                    continue;
                let item = clipBoardItems[i];
                if(item.kind !== "file")
                    continue;
                if(!(item.type === "image/png" || item.type === "image/jpeg"))
                    continue;
                
                let pasteImage = item.getAsFile();
                if(!pasteImage)
                    continue;
                    
                let extension = "";
                item.type === "image/png" ? extension = "png" : item.type === "image/jpeg" && (extension = "jpeg");
                
                event.preventDefault();

                let img = await blobToArrayBuffer(pasteImage);
                
                let datetime = window.moment().format(settings.dateTimeFormat);
                let name = new TemplateString(settings.pastedImageFileName).interpolate({
                    date: datetime
                });
                // let name = "image-" + window.moment().format("YYYYMMDDHHmmssSSS");

                //@ts-ignore
                let imageFile = await app.saveAttachment(name, extension, img);
                //@ts-ignore
                let markdownLink = await app.fileManager.generateMarkdownLink(imageFile, view.file.path);
                markdownLink += "\n\n";
                editor.replaceSelection(markdownLink);
            }
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
        let {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Custom Attachment Location'});

        new Setting(containerEl)
            .setName('Location for New Attachments')
            .setDesc('${filename}')
            .addText(text => text
                .setPlaceholder('assets/${filename}')
                .setValue(this.plugin.settings.attachmentFolder)
                .onChange(async (value) => {
                    console.log('attachmentFolder: ' + value);
                    this.plugin.settings.attachmentFolder = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Pasted Image Name')
            .setDesc('${date}')
            .addText(text => text
                .setPlaceholder('image-${date}')
                .setValue(this.plugin.settings.pastedImageFileName)
                .onChange(async (value) => {
                    console.log('pastedImageFileName: ' + value);
                    this.plugin.settings.pastedImageFileName = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Date Format')
            .setDesc('YYYYMMDDHHmmssSSS')
            .addText(text => text
                .setPlaceholder('YYYYMMDDHHmmssSSS')
                .setValue(this.plugin.settings.dateTimeFormat)
                .onChange(async (value) => {
                    console.log('dateTimeFormat: ' + value);
                    this.plugin.settings.dateTimeFormat = value;
                    await this.plugin.saveSettings();
                }));
    }
}
