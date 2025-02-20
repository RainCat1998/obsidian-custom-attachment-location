import { normalizePath } from 'obsidian';
import {
  getEnumKey,
  getEnumValue
} from 'obsidian-dev-utils/Enum';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';
import { SettingEx } from 'obsidian-dev-utils/obsidian/SettingEx';
import { isValidRegExp } from 'obsidian-dev-utils/RegExp';

import type { CustomAttachmentLocationPlugin } from './CustomAttachmentLocationPlugin.ts';

import { AttachmentRenameMode } from './CustomAttachmentLocationPluginSettings.ts';
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

    new SettingEx(this.containerEl)
      .setName('Location for new attachments')
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
      .addText((text) =>
        this.bind(text, 'attachmentFolderPath', {
          componentToPluginSettingsValueConverter(uiValue: string): string {
            return normalizePath(uiValue);
          },
          pluginSettingsToComponentValueConverter(pluginSettingsValue: string): string {
            return pluginSettingsValue;
          },
          valueValidator(uiValue): string {
            return validatePath(uiValue);
          }
        })
          // eslint-disable-next-line no-template-curly-in-string
          .setPlaceholder('./assets/${filename}')
      );

    new SettingEx(this.containerEl)
      .setName('Generated attachment filename')
      .setDesc(createFragment((f) => {
        f.appendText('See available ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens', text: 'tokens' });
      }))
      .addText((text) =>
        this.bind(text, 'generatedAttachmentFilename', {
          valueValidator(uiValue): string {
            return validatePath(uiValue);
          }
        })
          // eslint-disable-next-line no-template-curly-in-string
          .setPlaceholder('file-${date:YYYYMMDDHHmmssSSS}')
      );

    new SettingEx(this.containerEl)
      .setName('Attachment rename mode')
      .addDropdown((dropdown) => {
        dropdown.addOptions(AttachmentRenameMode);
        this.bind(dropdown, 'attachmentRenameMode', {
          componentToPluginSettingsValueConverter: (value) => getEnumValue(AttachmentRenameMode, value),
          pluginSettingsToComponentValueConverter: (value) => getEnumKey(AttachmentRenameMode, value)
        });
      });

    new SettingEx(this.containerEl)
      .setName('Should rename attachment folder')
      .setDesc(createFragment((f) => {
        f.appendText('When renaming md files, automatically rename attachment folder if folder name contains ');
        // eslint-disable-next-line no-template-curly-in-string
        appendCodeBlock(f, '${filename}');
        f.appendText('.');
      }))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldRenameAttachmentFolder');
      });

    new SettingEx(this.containerEl)
      .setName('Should rename attachment files')
      .setDesc(createFragment((f) => {
        f.appendText('When renaming md files, automatically rename attachment files if file name contains ');
        // eslint-disable-next-line no-template-curly-in-string
        appendCodeBlock(f, '${filename}');
        f.appendText('.');
      }))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldRenameAttachmentFiles');
      });

    new SettingEx(this.containerEl)
      .setName('Whitespace replacement')
      .setDesc(createFragment((f) => {
        f.appendText('Automatically replace whitespace in attachment folder and file name with the specified character.');
        f.appendChild(createEl('br'));
        f.appendText('Leave blank to disable replacement.');
      }))
      .addText((text) => {
        this.bind(text, 'whitespaceReplacement', {
          // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
          valueValidator(uiValue): string | void {
            if (uiValue === '') {
              return;
            }

            if (uiValue.length > 1) {
              return 'Whitespace replacement must be a single character or blank.';
            }

            if (INVALID_FILENAME_PATH_CHARS_REG_EXP.exec(uiValue)) {
              return 'Whitespace replacement must not contain invalid filename path characters.';
            }
          }
        })
          .setPlaceholder('-');
      });

    new SettingEx(this.containerEl)
      .setName('Should rename attachments to lowercase')
      .setDesc('Automatically set all characters in folder name and pasted image name to be lowercase.')
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldRenameAttachmentsToLowerCase');
      });

    new SettingEx(this.containerEl)
      .setName('Should convert pasted images to JPEG')
      .setDesc('Paste images from clipboard converting them to JPEG.')
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldConvertPastedImagesToJpeg');
      });

    new SettingEx(this.containerEl)
      .setName('JPEG Quality')
      .setDesc('The smaller the quality, the greater the compression ratio.')
      .addDropdown((dropDown) => {
        dropDown.addOptions(generateJpegQualityOptions());
        this.bind(dropDown, 'jpegQuality', {
          componentToPluginSettingsValueConverter: (value) => Number(value),
          pluginSettingsToComponentValueConverter: (value) => value.toString()
        });
      });

    new SettingEx(this.containerEl)
      .setName('Should rename collected attachments')
      .setDesc(createFragment((f) => {
        f.appendText('If enabled, attachments processed via ');
        appendCodeBlock(f, 'Collect attachments');
        f.appendText(' commands will be renamed according to the ');
        appendCodeBlock(f, 'Pasted File Name');
        f.appendText(' setting.');
      }))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldRenameCollectedAttachments');
      });

    new SettingEx(this.containerEl)
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
        this.bind(text, 'duplicateNameSeparator', {
          componentToPluginSettingsValueConverter: (value: string) => value.replaceAll(VISIBLE_WHITESPACE_CHARACTER, ' '),
          pluginSettingsToComponentValueConverter: showWhitespaceCharacter,
          valueValidator(uiValue): string {
            return validateFilename(`filename${uiValue}1`, false);
          }
        })
          .setPlaceholder(VISIBLE_WHITESPACE_CHARACTER);
        text.inputEl.addEventListener('input', () => {
          text.inputEl.value = showWhitespaceCharacter(text.inputEl.value);
        });
      });

    new SettingEx(this.containerEl)
      .setName('Should keep empty attachment folders')
      .setDesc('If enabled, empty attachment folders will be preserved, useful for source control purposes.')
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldKeepEmptyAttachmentFolders');
      });

    new SettingEx(this.containerEl)
      .setName('Should delete orphan attachments')
      .setDesc('If enabled, when the note is deleted, its orphan attachments are deleted as well.')
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldDeleteOrphanAttachments');
      });

    new SettingEx(this.containerEl)
      .setName('Include paths')
      .setDesc(createFragment((f) => {
        f.appendText('Include notes from the following paths');
        f.createEl('br');
        f.appendText('Insert each path on a new line');
        f.createEl('br');
        f.appendText('You can use path string or ');
        appendCodeBlock(f, '/regular expression/');
        f.createEl('br');
        f.appendText('If the setting is empty, all notes are included');
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'includePaths', {
          valueValidator: pathsValidator
        });
      });

    new SettingEx(this.containerEl)
      .setName('Exclude paths')
      .setDesc(createFragment((f) => {
        f.appendText('Exclude notes from the following paths');
        f.createEl('br');
        f.appendText('Insert each path on a new line');
        f.createEl('br');
        f.appendText('You can use path string or ');
        appendCodeBlock(f, '/regular expression/');
        f.createEl('br');
        f.appendText('If the setting is empty, no notes are excluded');
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'excludePaths', {
          valueValidator: pathsValidator
        });
      });

    new SettingEx(this.containerEl)
      .setName('Custom tokens')
      .setDesc(createFragment((f) => {
        f.appendText('Custom tokens to be used in the attachment folder path and pasted file name.');
        f.appendChild(createEl('br'));
        f.appendText('See ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens', text: 'documentation' });
        f.appendText(' for more information.');
      }))
      .addTextArea((textArea) => {
        this.bind(textArea, 'customTokensStr', {
          valueValidator: customTokensValidator
        });
      });
  }
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
function customTokensValidator(value: string): string | void {
  const formatters = getCustomTokenFormatters(value);
  if (formatters === null) {
    return 'Invalid custom tokens code';
  }
}

function generateJpegQualityOptions(): Record<string, string> {
  const MAX_QUALITY = 10;
  const ans: Record<string, string> = {};
  for (let i = 1; i <= MAX_QUALITY; i++) {
    const valueStr = (i / MAX_QUALITY).toFixed(1);
    ans[valueStr] = valueStr;
  }

  return ans;
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
function pathsValidator(paths: string[]): string | void {
  for (const path of paths) {
    if (path.startsWith('/') && path.endsWith('/')) {
      const regExp = path.slice(1, -1);
      if (!isValidRegExp(regExp)) {
        return `Invalid regular expression ${path}`;
      }
    }
  }
}

function showWhitespaceCharacter(value: string): string {
  return value.replaceAll(' ', VISIBLE_WHITESPACE_CHARACTER);
}
