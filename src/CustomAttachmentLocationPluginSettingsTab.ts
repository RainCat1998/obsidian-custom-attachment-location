import {
  normalizePath,
  PluginSettingTab,
  Setting
} from "obsidian";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import {
  validateFilename,
  validatePath
} from "./PathValidator.ts";

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
        f.appendText("Start with ");
        appendCodeBlock(f, ".");
        f.appendText(" to use relative path. Available variables: ");
        appendCodeBlock(f, "${filename}");
        f.appendText(", ");
        appendCodeBlock(f, "${date:format}");
        f.appendText(".");
        f.appendChild(createEl("br"));
        f.appendText("Don't use dot-folders like ");
        appendCodeBlock(f, ".attachments");
        f.appendText(", because Obsidian doesn't track them");
      }))
      .addText(text => text
        .setPlaceholder("./assets/${filename}")
        .setValue(settings.attachmentFolderPath)
        .onChange(async (value: string) => {
          console.debug("attachmentFolder: " + value);

          const validationError = validatePath(value);
          text.inputEl.setCustomValidity(validationError);
          text.inputEl.reportValidity();

          if (!validationError) {
            value = normalizePath(value);
            console.debug("normalized attachmentFolder: " + value);
            settings.attachmentFolderPath = value;
            await this.plugin.saveSettings(settings);
          }
        }));

    new Setting(this.containerEl)
      .setName("Pasted File Name")
      .setDesc(createFragment(f => {
        f.appendText("Available variables: ");
        appendCodeBlock(f, "${filename}");
        f.appendText(", ");
        appendCodeBlock(f, "${date:format}");
        f.appendText(", ");
        appendCodeBlock(f, "${originalCopiedFilename}");
        f.appendText(", ");
        appendCodeBlock(f, "${prompt}");
        f.appendText(".");
      }))
      .addText(text => text
        .setPlaceholder("file-${date:YYYYMMDDHHmmssSSS}")
        .setValue(settings.pastedFileName)
        .onChange(async (value: string) => {
          console.debug("pastedImageFileName: " + value);
          const validationError = validateFilename(value);
          text.inputEl.setCustomValidity(validationError);
          text.inputEl.reportValidity();

          if (!validationError) {
            settings.pastedFileName = value;
            await this.plugin.saveSettings(settings);
          }
        }));

    new Setting(this.containerEl)
      .setName("Automatically rename attachment folder")
      .setDesc(createFragment(f => {
        f.appendText("When renaming md files, automatically rename attachment folder if folder name contains ");
        appendCodeBlock(f, "${filename}");
        f.appendText(".");
      }))
      .addToggle(toggle => toggle
        .setValue(settings.autoRenameFolder)
        .onChange(async (value: boolean) => {
          settings.autoRenameFolder = value;
          this.display();
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("Automatically rename attachment files")
      .setDesc(createFragment(f => {
        f.appendText("When renaming md files, automatically rename attachment files if file name contains ");
        appendCodeBlock(f, "${filename}");
        f.appendText(".");
      }))
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
      .setName("Convert pasted images to JPEG")
      .setDesc("Paste images from clipboard converting them to JPEG.")
      .addToggle(toggle => toggle
        .setValue(settings.convertImagesToJpeg)
        .onChange(async (value) => {
          console.debug("pngToJpeg: " + value);
          settings.convertImagesToJpeg = value;
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("JPEG Quality")
      .setDesc("The smaller the quality, the greater the compression ratio.")
      .addDropdown(dropDown => dropDown
        .addOptions(generateJpegQualityOptions())
        .setValue(settings.jpegQuality.toString())
        .onChange(async (value) => {
          console.debug("jpegQuality: " + value);
          settings.jpegQuality = Number(value);
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("Convert images on drag&drop")
      .setDesc(createFragment(f => {
        f.appendText("If enabled and ");
        appendCodeBlock(f, "Convert pasted images to JPEG");
        f.appendText(" setting is enabled, images drag&dropped into the editor will be converted to JPEG.");
      }))
      .addToggle(toggle => toggle
        .setValue(settings.convertImagesOnDragAndDrop)
        .onChange(async (value) => {
          console.debug("convertImagesOnDragAndDrop: " + value);
          settings.convertImagesOnDragAndDrop = value;
          await this.plugin.saveSettings(settings);
        }));

    new Setting(this.containerEl)
      .setName("Rename attachments on drag&drop")
      .setDesc(createFragment(f => {
        f.appendText("If enabled, attachments dragged and dropped into the editor will be renamed according to the ");
        appendCodeBlock(f, "Pasted File Name");
        f.appendText(" setting.");
      }))
      .addToggle(toggle => toggle
        .setValue(settings.renameAttachmentsOnDragAndDrop)
        .onChange(async (value) => {
          console.debug("renameAttachmentsOnDragAndDrop: " + value);
          settings.renameAttachmentsOnDragAndDrop = value;
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

function appendCodeBlock(fragment: DocumentFragment, text: string): void {
  fragment.appendChild(createSpan({ cls: "markdown-rendered code" }, span => {
    span.style.fontWeight = "bold";
    span.appendChild(createEl("code", { text }));
  }));
}
