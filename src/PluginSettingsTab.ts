import type { BindOptionsExtended } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';
import type { ConditionalKeys } from 'type-fest';

import {
  debounce,
  normalizePath
} from 'obsidian';
import { convertAsyncToSync } from 'obsidian-dev-utils/Async';
import {
  getEnumKey,
  getEnumValue
} from 'obsidian-dev-utils/Enum';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { confirm } from 'obsidian-dev-utils/obsidian/Modals/Confirm';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';
import { EmptyAttachmentFolderBehavior } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { SettingEx } from 'obsidian-dev-utils/obsidian/SettingEx';

import type { PluginSettings } from './PluginSettings.ts';
import type { PluginTypes } from './PluginTypes.ts';

import {
  AttachmentRenameMode,
  CollectAttachmentUsedByMultipleNotesMode,
  SAMPLE_CUSTOM_TOKENS
} from './PluginSettings.ts';
import { TOKENIZED_STRING_LANGUAGE } from './PrismComponent.ts';
import { Substitutions } from './Substitutions.ts';

const VISIBLE_WHITESPACE_CHARACTER = '␣';

export class PluginSettingsTab extends PluginSettingsTabBase<PluginTypes> {
  public override display(): void {
    super.display();
    this.containerEl.empty();

    const bindOptionsWithTrim: BindOptionsExtended<PluginSettings, string, ConditionalKeys<PluginSettings, string>> = {
      componentToPluginSettingsValueConverter(uiValue: string): string {
        return normalizePath(uiValue.trimEnd());
      },
      pluginSettingsToComponentValueConverter(pluginSettingsValue: string): string {
        return pluginSettingsValue.trimEnd();
      }
    };

    new SettingEx(this.containerEl)
      .setName('Location for new attachments')
      .setDesc(createFragment((f) => {
        f.appendText('Start with ');
        appendCodeBlock(f, '.');
        f.appendText(' to use relative path.');
        f.createEl('br');
        f.appendText('See available ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens', text: 'tokens' });
        f.createEl('br');
        f.appendText('Dot-folders like ');
        appendCodeBlock(f, '.attachments');
        f.appendText(' are not recommended, because Obsidian doesn\'t track them. You might need to use ');
        f.createEl('a', { href: 'https://github.com/polyipseity/obsidian-show-hidden-files/', text: 'Show Hidden Files' });
        f.appendText(' Plugin to manage them.');
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'attachmentFolderPath', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName('Generated attachment file name')
      .setDesc(createFragment((f) => {
        f.appendText('See available ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens', text: 'tokens' });
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'generatedAttachmentFileName', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName('Markdown URL format')
      .setDesc(createFragment((f) => {
        f.appendText('Format for the URL that will be inserted into Markdown.');
        f.createEl('br');
        f.appendText('See available ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens', text: 'tokens' });
        f.createEl('br');
        f.appendText('Leave blank to use the default format.');
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'markdownUrlFormat', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName('Attachment rename mode')
      .setDesc(createFragment((f) => {
        f.appendText('When attaching files:');
        f.createEl('br');
        appendCodeBlock(f, 'None');
        f.appendText(' - their names are preserved.');
        f.createEl('br');
        appendCodeBlock(f, 'Only pasted images');
        f.appendText(' - only pasted images are renamed.');
        f.createEl('br');
        appendCodeBlock(f, 'All');
        f.appendText(' - all files are renamed.');
      }))
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
        appendCodeBlock(f, '${noteFileName}');
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
        appendCodeBlock(f, '${noteFileName}');
        f.appendText('.');
      }))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldRenameAttachmentFiles');
      });

    new SettingEx(this.containerEl)
      .setName('Special characters')
      .setDesc(createFragment((f) => {
        f.appendText('Special characters in attachment folder and file name to be replaced or removed.');
        f.createEl('br');
        f.appendText('Leave blank to preserve special characters.');
      }))
      .addText((text) => {
        this.bind(text, 'specialCharacters', {
          componentToPluginSettingsValueConverter: (value: string): string => value.replaceAll(VISIBLE_WHITESPACE_CHARACTER, ''),
          pluginSettingsToComponentValueConverter: (value: string): string => value.replaceAll(' ', VISIBLE_WHITESPACE_CHARACTER),
          shouldResetSettingWhenComponentIsEmpty: false
        });
        text.inputEl.addEventListener('input', () => {
          text.inputEl.value = showWhitespaceCharacter(text.inputEl.value);
        });
      });

    new SettingEx(this.containerEl)
      .setName('Special characters replacement')
      .setDesc(createFragment((f) => {
        f.appendText('Replacement string for special characters in attachment folder and file name.');
        f.createEl('br');
        f.appendText('Leave blank to remove special characters.');
      }))
      .addText((text) => {
        this.bind(text, 'specialCharactersReplacement', {
          shouldResetSettingWhenComponentIsEmpty: false
        });
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
      .setName('Collect attachment used by multiple notes mode')
      .setDesc(createFragment((f) => {
        f.appendText('When the collected attachment is used by multiple notes:');
        f.createEl('br');
        appendCodeBlock(f, 'Skip');
        f.appendText(' - skip the attachment and proceed to the next one.');
        f.createEl('br');
        appendCodeBlock(f, 'Move');
        f.appendText(' - move the attachment to the new location.');
        f.createEl('br');
        appendCodeBlock(f, 'Copy');
        f.appendText(' - copy the attachment to the new location.');
        f.createEl('br');
        appendCodeBlock(f, 'Cancel');
        f.appendText(' - cancel the attachment collecting.');
        f.createEl('br');
        appendCodeBlock(f, 'Prompt');
        f.appendText(' - prompt the user to select the action.');
      }))
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          /* eslint-disable perfectionist/sort-objects */
          [CollectAttachmentUsedByMultipleNotesMode.Skip]: 'Skip',
          [CollectAttachmentUsedByMultipleNotesMode.Move]: 'Move',
          [CollectAttachmentUsedByMultipleNotesMode.Copy]: 'Copy',
          [CollectAttachmentUsedByMultipleNotesMode.Cancel]: 'Cancel',
          [CollectAttachmentUsedByMultipleNotesMode.Prompt]: 'Prompt'
          /* eslint-enable perfectionist/sort-objects */
        });
        this.bind(dropdown, 'collectAttachmentUsedByMultipleNotesMode', {
          componentToPluginSettingsValueConverter: (value) => getEnumValue(CollectAttachmentUsedByMultipleNotesMode, value),
          pluginSettingsToComponentValueConverter: (value) => getEnumKey(CollectAttachmentUsedByMultipleNotesMode, value)
        });
      });

    new SettingEx(this.containerEl)
      .setName('Duplicate name separator')
      .setDesc(createFragment((f) => {
        f.appendText('When you are pasting/dragging a file with the same name as an existing file, this separator will be added to the file name.');
        f.createEl('br');
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
          pluginSettingsToComponentValueConverter: showWhitespaceCharacter
        });
        text.inputEl.addEventListener('input', () => {
          text.inputEl.value = showWhitespaceCharacter(text.inputEl.value);
        });
      });

    new SettingEx(this.containerEl)
      .setName('Empty attachment folder behavior')
      .setDesc(createFragment((f) => {
        f.appendText('When the attachment folder becomes empty:');
        f.createEl('br');
        appendCodeBlock(f, 'Keep');
        f.appendText(' - will keep the empty attachment folder.');
        f.createEl('br');
        appendCodeBlock(f, 'Delete');
        f.appendText(' - will delete the empty attachment folder.');
        f.createEl('br');
        appendCodeBlock(f, 'Delete with empty parents');
        f.appendText(' - will delete the empty attachment folder and its empty parent folders.');
      }))
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          /* eslint-disable perfectionist/sort-objects */
          [EmptyAttachmentFolderBehavior.Keep]: 'Keep',
          [EmptyAttachmentFolderBehavior.Delete]: 'Delete',
          [EmptyAttachmentFolderBehavior.DeleteWithEmptyParents]: 'Delete with empty parents'
          /* eslint-enable perfectionist/sort-objects */
        });
        this.bind(dropdown, 'emptyAttachmentFolderBehavior', {
          componentToPluginSettingsValueConverter: (value) => getEnumValue(EmptyAttachmentFolderBehavior, value),
          pluginSettingsToComponentValueConverter: (value) => getEnumKey(EmptyAttachmentFolderBehavior, value)
        });
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
        f.appendText('Include notes from the following paths.');
        f.createEl('br');
        f.appendText('Insert each path on a new line.');
        f.createEl('br');
        f.appendText('You can use path string or ');
        appendCodeBlock(f, '/regular expression/.');
        f.createEl('br');
        f.appendText('If the setting is empty, all notes are included.');
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'includePaths');
      });

    new SettingEx(this.containerEl)
      .setName('Exclude paths')
      .setDesc(createFragment((f) => {
        f.appendText('Exclude notes from the following paths.');
        f.createEl('br');
        f.appendText('Insert each path on a new line.');
        f.createEl('br');
        f.appendText('You can use path string or ');
        appendCodeBlock(f, '/regular expression/.');
        f.createEl('br');
        f.appendText('If the setting is empty, no notes are excluded.');
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'excludePaths');
      });

    new SettingEx(this.containerEl)
      .setName('Exclude paths from attachment collecting')
      .setDesc(createFragment((f) => {
        f.appendText('Exclude attachments from the following paths when ');
        appendCodeBlock(f, 'Collect attachments');
        f.appendText(' command is executed.');
        f.createEl('br');
        f.appendText('Insert each path on a new line.');
        f.createEl('br');
        f.appendText('You can use path string or ');
        appendCodeBlock(f, '/regular expression/.');
        f.createEl('br');
        f.appendText('If the setting is empty, no paths are excluded from attachment collecting.');
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'excludePathsFromAttachmentCollecting');
      });

    const REGISTER_CUSTOM_TOKENS_DEBOUNCE_IN_MILLISECONDS = 2000;
    const registerCustomTokensDebounced = debounce((customTokensStr: string, inputEl: HTMLInputElement) => {
      inputEl.trigger('input');

      if (this.plugin.settingsManager.settingsWrapper.validationMessages.customTokensStr) {
        return;
      }

      Substitutions.registerCustomTokens(customTokensStr);
    }, REGISTER_CUSTOM_TOKENS_DEBOUNCE_IN_MILLISECONDS);

    new SettingEx(this.containerEl)
      .setName('Custom tokens')
      .setDesc(createFragment((f) => {
        f.appendText('Custom tokens to be used in the attachment folder path and pasted file name.');
        f.createEl('br');
        f.appendText('See ');
        f.createEl('a', { href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens', text: 'documentation' });
        f.appendText(' for more information.');
        f.createEl('br');
        f.appendText('⚠️ Custom tokens can be an arbitrary JavaScript code. If poorly written, it can cause the data loss. Use it at your own risk.');
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage('javascript');
        codeHighlighter.inputEl.addClass('custom-tokens-setting-control');
        this.bind(codeHighlighter, 'customTokensStr', {
          onChanged: (newValue) => {
            registerCustomTokensDebounced(newValue, codeHighlighter.inputEl);
          }
        });
        codeHighlighter.setPlaceholder(SAMPLE_CUSTOM_TOKENS);
      });
    this.plugin.settingsManager.shouldDebounceCustomTokensValidation = true;

    new SettingEx(this.containerEl)
      .addButton((button) => {
        button.setButtonText('Reset to sample custom tokens');
        button.setWarning();
        button.onClick(convertAsyncToSync(async () => {
          if (this.plugin.settings.customTokensStr === SAMPLE_CUSTOM_TOKENS) {
            return;
          }

          if (
            this.plugin.settings.customTokensStr !== '' && !await confirm({
              app: this.plugin.app,
              message: 'Are you sure you want to reset the custom tokens to the sample custom tokens? Your changes will be lost.',
              title: 'Reset to sample custom tokens'
            })
          ) {
            return;
          }

          await this.plugin.settingsManager.editAndSave((setting) => {
            setting.customTokensStr = SAMPLE_CUSTOM_TOKENS;
          });
          this.display();
        }));
      });

    new SettingEx(this.containerEl)
      .setName('Treat as attachment extensions')
      .setDesc(createFragment((f) => {
        f.appendText('Treat files with these extensions as attachments.');
        f.createEl('br');
        f.appendText('By default, ');
        appendCodeBlock(f, '.md');
        f.appendText(', ');
        appendCodeBlock(f, '.canvas');
        f.appendText(' and ');
        appendCodeBlock(f, '.base');
        f.appendText(' linked files are not treated as attachments and are not moved with the note.');
        f.createEl('br');
        f.appendText('You can add custom extensions, e.g. ');
        appendCodeBlock(f, '.foo.md');
        f.appendText(', ');
        appendCodeBlock(f, '.bar.canvas');
        f.appendText(', ');
        appendCodeBlock(f, '.baz.base');
        f.appendText(', to override this behavior.');
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'treatAsAttachmentExtensions');
      });
  }

  public override hide(): void {
    super.hide();
    this.plugin.settingsManager.shouldDebounceCustomTokensValidation = false;
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

function showWhitespaceCharacter(value: string): string {
  return value.replaceAll(' ', VISIBLE_WHITESPACE_CHARACTER);
}
