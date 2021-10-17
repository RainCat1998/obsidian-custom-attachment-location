import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface CustomAttachmentLocationSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CustomAttachmentLocationSettings = {
	mySetting: 'default'
}

let triggered = false;
let originalSettings = {
	newLinkFormat: "",
	attachmentFolderPath: ""
};

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

	handlePaste(event: ClipboardEvent, editor: Editor, view: MarkdownView){
		console.log("Handle Paste");
		if(triggered)
			return;
		
		let filename = view.file.basename;

		//@ts-ignore
		app.vault.setConfig("attachmentFolderPath", `./assets/${filename}`);
		
		triggered = true;
		//@ts-ignore
        editor.cm._handlers.paste[0](null, event);
		event.preventDefault();
		triggered = false;
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
			.setDesc('${filename}, ${date}')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
