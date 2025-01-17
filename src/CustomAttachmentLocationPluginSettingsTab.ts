import {
  normalizePath,
  Setting
} from 'obsidian';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';
import { extend } from 'obsidian-dev-utils/obsidian/Plugin/ValueComponent';

import type { CustomAttachmentLocationPlugin } from './CustomAttachmentLocationPlugin.ts';

import {
  getCustomTokenFormatters,
  INVALID_FILENAME_PATH_CHARS_REG_EXP,
  validateFilename,
  validatePath
} from './Substitutions.ts';

const VISIBLE_WHITESPACE_CHARACTER = '␣';

export class CustomAttachmentLocationPluginSettingsTab extends PluginSettingsTabBase<CustomAttachmentLocationPlugin> {
  public override display(): void {
    this.containerEl.empty();

    new Setting(this.containerEl)
      .setName('Location for New Attachments')
      .setDesc(createFragment((f) => {
        f.appendText('Start with ');
        appendCodeBlock(f, '.');
        f.appendText(' to use relative path.');
        f.createEl('br');
        f.appendText('See available ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens', text: 'tokens' });
        f.appendChild(createEl('br'));
        f.appendText('Dot-folders like ');
        appendCodeBlock(f, '.attachments');
        f.appendText(' are not recommended, because Obsidian doesn\'t track them. You might need to use ');
        f.createEl('a', { href: 'https://github.com/polyipseity/obsidian-show-hidden-files/', text: 'Show Hidden Files' });
        f.appendText(' Plugin to manage them.');
      }))
      .addText((text) => extend(text).bind(this.plugin, 'attachmentFolderPath', {
        componentToPluginSettingsValueConverter(uiValue: string): string {
          return normalizePath(uiValue);
        },
        pluginSettingsToComponentValueConverter(pluginSettingsValue: string): string {
          return pluginSettingsValue;
        },
        valueValidator(uiValue): null | string {
          return validatePath(uiValue);
        }
      })
        .setPlaceholder('./assets/${filename}')
      );

    new Setting(this.containerEl)
      .setName('Pasted File Name')
      .setDesc(createFragment((f) => {
        f.appendText('See available ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens', text: 'tokens' });
      }))
      .addText((text) => extend(text).bind(this.plugin, 'pastedFileName', {
        valueValidator(uiValue): null | string {
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
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'autoRenameFolder'));

    new Setting(this.containerEl)
      .setName('Automatically rename attachment files')
      .setDesc(createFragment((f) => {
        f.appendText('When renaming md files, automatically rename attachment files if file name contains ');
        appendCodeBlock(f, '${filename}');
        f.appendText('.');
      }))
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'autoRenameFiles'));

    new Setting(this.containerEl)
      .setName('Replace whitespaces')
      .setDesc(createFragment((f) => {
        f.appendText('Automatically replace whitespace in attachment folder and file name with the specified character.');
        f.appendChild(createEl('br'));
        f.appendText('Leave blank to disable replacement.');
      }))
      .addText((text) => extend(text)
        .bind(this.plugin, 'whitespaceReplacement', {
          valueValidator(uiValue): null | string {
            if (uiValue === '') {
              return null;
            }

            if (uiValue.length > 1) {
              return 'Whitespace replacement must be a single character or blank.';
            }

            if (INVALID_FILENAME_PATH_CHARS_REG_EXP.exec(uiValue)) {
              return 'Whitespace replacement must not contain invalid filename path characters.';
            }

            return null;
          }
        })
        .setPlaceholder('-'));

    new Setting(this.containerEl)
      .setName('All lowercase names')
      .setDesc('Automatically set all characters in folder name and pasted image name to be lowercase.')
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'toLowerCase'));

    new Setting(this.containerEl)
      .setName('Convert pasted images to JPEG')
      .setDesc('Paste images from clipboard converting them to JPEG.')
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'convertImagesToJpeg'));

    new Setting(this.containerEl)
      .setName('JPEG Quality')
      .setDesc('The smaller the quality, the greater the compression ratio.')
      .addDropdown((dropDown) => {
        dropDown.addOptions(generateJpegQualityOptions());
        extend(dropDown).bind(this.plugin, 'jpegQuality', {
          componentToPluginSettingsValueConverter: (value) => Number(value),
          pluginSettingsToComponentValueConverter: (value) => value.toString()
        });
      });

    new Setting(this.containerEl)
      .setName('Convert images on drag&drop')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled and ');
        appendCodeBlock(f, 'Convert pasted images to JPEG');
        f.appendText(' setting is enabled, images drag&dropped into the editor will be converted to JPEG.');
      }))
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'convertImagesOnDragAndDrop'));

    new Setting(this.containerEl)
      .setName('Rename only images')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, only image files will be renamed.');
        f.appendChild(createEl('br'));
        f.appendText('If disabled, all attachment files will be renamed.');
      }))
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'renameOnlyImages'));

    new Setting(this.containerEl)
      .setName('Rename pasted files with known names')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, pasted copied files with known names will be renamed.');
        f.appendChild(createEl('br'));
        f.appendText('If disabled, only clipboard image objects (e.g., screenshots) will be renamed.');
      }))
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'renamePastedFilesWithKnownNames'));

    new Setting(this.containerEl)
      .setName('Rename attachments on drag&drop')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, attachments dragged and dropped into the editor will be renamed according to the ');
        appendCodeBlock(f, 'Pasted File Name');
        f.appendText(' setting.');
      }))
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'renameAttachmentsOnDragAndDrop'));

    new Setting(this.containerEl)
      .setName('Rename attachments on collecting')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, attachments processed via ');
        appendCodeBlock(f, 'Collect attachments');
        f.appendText(' commands will be renamed according to the ');
        appendCodeBlock(f, 'Pasted File Name');
        f.appendText(' setting.');
      }))
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'renameCollectedFiles'));

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
      .addText((text) => {
        extend(text).bind(this.plugin, 'duplicateNameSeparator', {
          componentToPluginSettingsValueConverter: (value: string) => value.replaceAll(VISIBLE_WHITESPACE_CHARACTER, ' '),
          pluginSettingsToComponentValueConverter: showWhitespaceCharacter,
          valueValidator(uiValue): null | string {
            return validateFilename(`filename${uiValue}1`, false);
          }
        })
          .setPlaceholder(VISIBLE_WHITESPACE_CHARACTER);
        text.inputEl.addEventListener('input', () => {
          text.inputEl.value = showWhitespaceCharacter(text.inputEl.value);
        });
      });

    new Setting(this.containerEl)
      .setName('Keep empty attachment folders')
      .setDesc('If enabled, empty attachment folders will be preserved, useful for source control purposes.')
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'keepEmptyAttachmentFolders'));

    new Setting(this.containerEl)
      .setName('Delete orphan attachments')
      .setDesc('If enabled, when the note is deleted, its orphan attachments are deleted as well.')
      .addToggle((toggle) => extend(toggle).bind(this.plugin, 'deleteOrphanAttachments'));

    new Setting(this.containerEl)
      .setName('Custom tokens')
      .setDesc(createFragment((f) => {
        f.appendText('Custom tokens to be used in the attachment folder path and pasted file name.');
        f.appendChild(createEl('br'));
        f.appendText('See ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens', text: 'documentation' });
        f.appendText(' for more information.');
      }))
      .addTextArea((textArea) => extend(textArea).bind(this.plugin, 'customTokensStr', {
        valueValidator: customTokensValidator
      }));
  }
}

function customTokensValidator(value: string): null | string {
  const formatters = getCustomTokenFormatters(value);
  if (formatters === null) {
    return 'Invalid custom tokens code';
  }

  return null;
}

function generateJpegQualityOptions(): Record<string, string> {
  const ans: Record<string, string> = {};
  for (let i = 1; i <= 10; i++) {
    const valueStr = (i / 10).toFixed(1);
    ans[valueStr] = valueStr;
  }

  return ans;
}

function showWhitespaceCharacter(value: string): string {
  return value.replaceAll(' ', VISIBLE_WHITESPACE_CHARACTER);
}
