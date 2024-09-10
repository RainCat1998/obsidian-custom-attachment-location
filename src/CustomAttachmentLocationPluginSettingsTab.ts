import {
  normalizePath,
  Setting
} from 'obsidian';
import { appendCodeBlock } from 'obsidian-dev-utils/DocumentFragment';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';
import { bindUiComponent } from 'obsidian-dev-utils/obsidian/Plugin/UIComponent';

import type CustomAttachmentLocationPlugin from './CustomAttachmentLocationPlugin.ts';
import {
  validateFilename,
  validatePath
} from './PathValidator.ts';

export default class CustomAttachmentLocationPluginSettingsTab extends PluginSettingsTabBase<CustomAttachmentLocationPlugin> {
  public override display(): void {
    this.containerEl.empty();

    new Setting(this.containerEl)
      .setName('Location for New Attachments')
      .setDesc(createFragment((f) => {
        f.appendText('Start with ');
        appendCodeBlock(f, '.');
        f.appendText(' to use relative path. Available variables: ');
        appendCodeBlock(f, '${filename}');
        f.appendText(', ');
        appendCodeBlock(f, '${foldername}');
        f.appendText(', ');
        appendCodeBlock(f, '${folderPath}');
        f.appendText(', ');
        appendCodeBlock(f, '${date:format}');
        f.appendText('.');
        f.appendChild(createEl('br'));
        f.appendText('Dot-folders like ');
        appendCodeBlock(f, '.attachments');
        f.appendText(' are not recommended, because Obsidian doesn\'t track them. You might need to use ');
        f.createEl('a', { href: 'https://github.com/polyipseity/obsidian-show-hidden-files/', text: 'Show Hidden Files' });
        f.appendText(' Plugin to manage them.');
      }))
      .addText((text) => bindUiComponent(this.plugin, text, 'attachmentFolderPath', {
        uiValueValidator(uiValue): string | null {
          return validatePath(uiValue);
        },
        settingToUIValueConverter(pluginValue: string): string {
          return pluginValue;
        },
        uiToSettingValueConverter(uiValue: string): string {
          return normalizePath(uiValue);
        }
      })
        .setPlaceholder('./assets/${filename}')
      );

    new Setting(this.containerEl)
      .setName('Pasted File Name')
      .setDesc(createFragment((f) => {
        f.appendText('Available variables: ');
        appendCodeBlock(f, '${filename}');
        f.appendText(', ');
        appendCodeBlock(f, '${foldername}');
        f.appendText(', ');
        appendCodeBlock(f, '${date:format}');
        f.appendText(', ');
        appendCodeBlock(f, '${originalCopiedFilename}');
        f.appendText(', ');
        appendCodeBlock(f, '${prompt}');
        f.appendText('.');
      }))
      .addText((text) => bindUiComponent(this.plugin, text, 'pastedFileName', {
        uiValueValidator(uiValue): string | null {
          return validatePath(uiValue);
        }
      })
        .setPlaceholder('file-${date:YYYYMMDDHHmmssSSS}')
      );

    new Setting(this.containerEl)
      .setName('Automatically rename attachment folder')
      .setDesc(createFragment((f) => {
        f.appendText('When renaming md files, automatically rename attachment folder if folder name contains ');
        appendCodeBlock(f, '${filename}');
        f.appendText('.');
      }))
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'autoRenameFolder'));

    new Setting(this.containerEl)
      .setName('Automatically rename attachment files')
      .setDesc(createFragment((f) => {
        f.appendText('When renaming md files, automatically rename attachment files if file name contains ');
        appendCodeBlock(f, '${filename}');
        f.appendText('.');
      }))
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'autoRenameFiles'));

    new Setting(this.containerEl)
      .setName('Replace whitespace with hyphen')
      .setDesc('Automatically replace whitespace in attachment folder and file name with hyphens.')
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'replaceWhitespace'));

    new Setting(this.containerEl)
      .setName('All lowercase names')
      .setDesc('Automatically set all characters in folder name and pasted image name to be lowercase.')
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'toLowerCase'));

    new Setting(this.containerEl)
      .setName('Convert pasted images to JPEG')
      .setDesc('Paste images from clipboard converting them to JPEG.')
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'convertImagesToJpeg'));

    new Setting(this.containerEl)
      .setName('JPEG Quality')
      .setDesc('The smaller the quality, the greater the compression ratio.')
      .addDropdown((dropDown) => {
        dropDown.addOptions(generateJpegQualityOptions());
        bindUiComponent(this.plugin, dropDown, 'jpegQuality', {
          settingToUIValueConverter: (value) => value.toString(),
          uiToSettingValueConverter: (value) => Number(value)
        });
      });

    new Setting(this.containerEl)
      .setName('Convert images on drag&drop')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled and ');
        appendCodeBlock(f, 'Convert pasted images to JPEG');
        f.appendText(' setting is enabled, images drag&dropped into the editor will be converted to JPEG.');
      }))
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'convertImagesOnDragAndDrop'));

    new Setting(this.containerEl)
      .setName('Rename only images')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, only image files will be renamed.');
        f.appendChild(createEl('br'));
        f.appendText('If disabled, all attachment files will be renamed.');
      }))
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'renameOnlyImages'));

    new Setting(this.containerEl)
      .setName('Rename pasted files with known names')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, pasted copied files with known names will be renamed.');
        f.appendChild(createEl('br'));
        f.appendText('If disabled, only clipboard image objects (e.g., screenshots) will be renamed.');
      }))
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'renamePastedFilesWithKnownNames'));

    new Setting(this.containerEl)
      .setName('Rename attachments on drag&drop')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, attachments dragged and dropped into the editor will be renamed according to the ');
        appendCodeBlock(f, 'Pasted File Name');
        f.appendText(' setting.');
      }))
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'renameAttachmentsOnDragAndDrop'));

    new Setting(this.containerEl)
      .setName('Rename attachments on collecting')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, attachments processed via ');
        appendCodeBlock(f, 'Collect attachments');
        f.appendText(' commands will be renamed according to the ');
        appendCodeBlock(f, 'Pasted File Name');
        f.appendText(' setting.');
      }))
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'renameCollectedFiles'));

    new Setting(this.containerEl)
      .setName('Duplicate name separator')
      .setDesc(createFragment((f) => {
        f.appendText('When you are pasting/dragging a file with the same name as an existing file, this separator will be added to the file name.');
        f.appendChild(createEl('br'));
        f.appendText('E.g., when you are dragging file ');
        appendCodeBlock(f, 'existingFile.pdf');
        f.appendText(', it will be renamed to ');
        appendCodeBlock(f, 'existingFile 1.pdf');
        f.appendText(', ');
        appendCodeBlock(f, 'existingFile 2.pdf');
        f.appendText(', etc, getting the first name available.');
      }))
      .addText((text) => bindUiComponent(this.plugin, text, 'duplicateNameSeparator', {
        uiValueValidator(uiValue): string | null {
          return uiValue === '' ? null : validateFilename(uiValue);
        }
      })
        .setPlaceholder(' ')
      );

    new Setting(this.containerEl)
      .setName('Keep empty attachment folders')
      .setDesc('If enabled, empty attachment folders will be preserved, useful for source control purposes.')
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'keepEmptyAttachmentFolders'));

    new Setting(this.containerEl)
      .setName('Delete orphan attachments')
      .setDesc('If enabled, when the note is deleted, its orphan attachments are deleted as well.')
      .addToggle((toggle) => bindUiComponent(this.plugin, toggle, 'deleteOrphanAttachments'));
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
