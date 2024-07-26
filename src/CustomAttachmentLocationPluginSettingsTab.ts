import {
  normalizePath,
  PluginSettingTab,
  Setting
} from "obsidian";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";

export default class CustomAttachmentLocationPluginSettingsTab extends PluginSettingTab {
  public override plugin: CustomAttachmentLocationPlugin;

  public constructor(plugin: CustomAttachmentLocationPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  public override display(): void {
    this.containerEl.empty();

    const settings = this.plugin.settings;

    new Setting(this.containerEl)
      .setName("Location for New Attachments")
      .setDesc(createFragment(f => {
        f.appendText("Start with \"./\" to use relative path. Available variables: ${filename}, ${date:format}.");
        f.appendChild(createEl("br"));
        f.appendText("Don't use dot-folders like \".attachments\", because Obsidian doesn't track them");
      }))
      .addText(text => text
        .setPlaceholder("./assets/${filename}")
        .setValue(settings.attachmentFolderPath)
        .onChange(async (value: string) => {
          console.log("attachmentFolder: " + value);

          if (value.startsWith("/")) {
            text.inputEl.setCustomValidity("Don't start with /");
          } else if (value.endsWith("/")) {
            text.inputEl.setCustomValidity("Don't end with /");
          } else {
            const parts = value.split("/");
            const dotFolderPart = parts.filter(part => part.startsWith(".") && part !== ".")[0];
            if (dotFolderPart) {
              text.inputEl.setCustomValidity(`Don't use dot-folders like "${dotFolderPart}"`);
            } else {
              text.inputEl.setCustomValidity("");
              value = normalizePath(value);
              console.log("normalized attachmentFolder: " + value);
              settings.attachmentFolderPath = value;
              await this.plugin.saveSettings(settings);
            }
          }

          text.inputEl.reportValidity();
        }));

    new Setting(this.containerEl)
      .setName("Pasted Image Name")
      .setDesc("Available variables: ${filename}, ${date:format}.")
      .addText(text => text
        .setPlaceholder("image-${date:YYYYMMDDHHmmssSSS}")
        .setValue(settings.pastedImageFileName)
        .onChange(async (value: string) => {
          console.log("pastedImageFileName: " + value);
          settings.pastedImageFileName = value;
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("Automatically rename attachment folder")
      .setDesc("When renaming md files, automatically rename attachment folder if folder name contains \"${filename}\".")
      .addToggle(toggle => toggle
        .setValue(settings.autoRenameFolder)
        .onChange(async (value: boolean) => {
          settings.autoRenameFolder = value;
          this.display();
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("Automatically rename attachment files")
      .setDesc("When renaming md files, automatically rename attachment files if file name contains \"${filename}\".")
      .addToggle(toggle => toggle
        .setValue(settings.autoRenameFiles)
        .onChange(async (value: boolean) => {
          settings.autoRenameFiles = value;
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("Replace whitespace with hyphen")
      .setDesc("Automatically replace whitespace in attachment folder and file name with hyphens.")
      .addToggle(toggle => toggle
        .setValue(settings.replaceWhitespace)
        .onChange(async (value: boolean) => {
          settings.replaceWhitespace = value;
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("All lowercase names")
      .setDesc("Automatically set all characters in folder name and pasted image name to be lowercase.")
      .addToggle(toggle => toggle
        .setValue(settings.toLowerCase)
        .onChange(async (value: boolean) => {
          settings.toLowerCase = value;
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("Convert pasted PNG to JPEG")
      .setDesc("Paste images from clipboard converting them from PNG to JPEG.")
      .addToggle(toggle => toggle
        .setValue(settings.pngToJpeg)
        .onChange(async (value) => {
          console.log("pngToJpeg: " + value);
          settings.pngToJpeg = value;
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("JPEG Quality")
      .setDesc("The smaller the quality, the greater the compression ratio.")
      .addDropdown(toggle => toggle
        .addOptions(generateJpegQualityOptions())
        .setValue(settings.jpegQuality.toString())
        .onChange(async (value) => {
          console.log("jpegQuality: " + value);
          settings.jpegQuality = Number(value);
          await this.plugin.saveSettings(settings);
        }));
  }
}

function generateJpegQualityOptions(): Record<string, string> {
  const ans: Record<string, string> = {};
  for (let i = 1; i <= 10; i++) {
    const valueStr = (i / 10).toFixed(1);
    ans[valueStr] = valueStr;
  }

  return ans;
}
