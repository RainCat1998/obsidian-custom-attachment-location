import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface CustomAttachmentLocationSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CustomAttachmentLocationSettings = {
	mySetting: 'default'
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

		let filename = view.file.basename;

		//@ts-ignore
		app.vault.setConfig("attachmentFolderPath", `./assets/${filename}`);
        let clipBoardData = event.clipboardData;
        let clipBoardItems = clipBoardData.items;
        if(!clipBoardData.getData("text/plain")){
	        for(let i in clipBoardItems){
		        if(!clipBoardItems.hasOwnProperty(i))
			        continue;
                let item = clipBoardItems[i];
                if(item.kind !== "file")
                    continue;
                let pasteImage = item.getAsFile();
                if(!pasteImage)
                    continue;
                    
                let extension = "";
                item.type === "image/png" ? extension = "png" : item.type === "image/jpeg" && (extension = "jpeg");
                
                event.preventDefault();

                let data = await blobToArrayBuffer(pasteImage);
                let name = "image-" + window.moment().format("YYYYMMDDHHmmssSSS");
                //@ts-ignore
                let imageFile = await app.saveAttachment(name, extension, data);
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
				.setPlaceholder('Not available now')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('filename: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
