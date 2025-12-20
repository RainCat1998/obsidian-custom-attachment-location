import type { BindOptionsExtended } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';
import type { ConditionalKeys } from 'type-fest';

import {
  debounce,
  normalizePath,
  TextComponent
} from 'obsidian';
import {
  convertAsyncToSync,
  invokeAsyncSafely
} from 'obsidian-dev-utils/Async';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import { confirm } from 'obsidian-dev-utils/obsidian/Modals/Confirm';
import { PluginSettingsTabBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginSettingsTabBase';
import { EmptyAttachmentFolderBehavior } from 'obsidian-dev-utils/obsidian/RenameDeleteHandler';
import { SettingEx } from 'obsidian-dev-utils/obsidian/SettingEx';

import type { PluginSettings } from './PluginSettings.ts';
import type { PluginTypes } from './PluginTypes.ts';

import {
  AttachmentRenameMode,
  CollectAttachmentUsedByMultipleNotesMode,
  DefaultImageSizeDimension,
  MoveAttachmentToProperFolderUsedByMultipleNotesMode,
  SAMPLE_CUSTOM_TOKENS
} from './PluginSettings.ts';
import { TOKENIZED_STRING_LANGUAGE } from './PrismComponent.ts';
import { Substitutions } from './Substitutions.ts';

const VISIBLE_SPACE_CHARACTER = '␣';

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
      },
      shouldResetSettingWhenComponentIsEmpty: true,
      shouldShowPlaceholderForDefaultValues: false
    };

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.locationForNewAttachments.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.locationForNewAttachments.description.part1));
        f.appendText(' ');
        appendCodeBlock(f, '.');
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.locationForNewAttachments.description.part2));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.locationForNewAttachments.description.part3));
        f.appendText(' ');
        f.createEl('a', {
          href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
          text: t(($) => $.pluginSettingsTab.locationForNewAttachments.description.part4)
        });
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.locationForNewAttachments.description.part5));
        f.appendText(' ');
        appendCodeBlock(f, '.attachments');
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.locationForNewAttachments.description.part6));
        f.appendText(' ');
        f.createEl('a', { href: 'https://github.com/polyipseity/obsidian-show-hidden-files/', text: 'Show Hidden Files' });
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.locationForNewAttachments.description.part7));
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'attachmentFolderPath', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.generatedAttachmentFileName.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.generatedAttachmentFileName.description.part1));
        f.appendText(' ');
        f.createEl('a', {
          href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
          text: t(($) => $.pluginSettingsTab.generatedAttachmentFileName.description.part2)
        });
        f.appendText('.');
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'generatedAttachmentFileName', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.markdownUrlFormat.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.markdownUrlFormat.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.markdownUrlFormat.description.part2));
        f.appendText(' ');
        f.createEl('a', {
          href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
          text: t(($) => $.pluginSettingsTab.markdownUrlFormat.description.part3)
        });
        f.appendText('.');
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.markdownUrlFormat.description.part4));
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'markdownUrlFormat', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.attachmentRenameMode.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.attachmentRenameMode.description.part1));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.attachmentRenameMode.none.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.attachmentRenameMode.none.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.attachmentRenameMode.onlyPastedImages.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.attachmentRenameMode.onlyPastedImages.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.attachmentRenameMode.all.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.attachmentRenameMode.all.description));
      }))
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          /* eslint-disable perfectionist/sort-objects -- Need to keep enum order. */
          [AttachmentRenameMode.None]: t(($) => $.pluginSettings.attachmentRenameMode.none.displayText),
          [AttachmentRenameMode.OnlyPastedImages]: t(($) => $.pluginSettings.attachmentRenameMode.onlyPastedImages.displayText),
          [AttachmentRenameMode.All]: t(($) => $.pluginSettings.attachmentRenameMode.all.displayText)
          /* eslint-enable perfectionist/sort-objects -- Need to keep enum order. */
        });
        this.bind(dropdown, 'attachmentRenameMode');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.shouldHandleRenames.name))
      .setDesc(t(($) => $.pluginSettingsTab.shouldHandleRenames.description))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldHandleRenames', {
          onChanged: () => {
            this.display();
          }
        });
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.shouldRenameAttachmentFolders.name))
      .setDesc(t(($) => $.pluginSettingsTab.shouldRenameAttachmentFolders.description))
      .addToggle((toggle) => {
        if (this.plugin.settings.shouldHandleRenames) {
          this.bind(toggle, 'shouldRenameAttachmentFolder');
        } else {
          toggle.setDisabled(true);
          toggle.setValue(false);
        }
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.shouldRenameAttachmentFiles.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.shouldRenameAttachmentFiles.description.part1));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.pluginSettingsTab.renamedAttachmentFileName.name));
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.shouldRenameAttachmentFiles.description.part2));
      }))
      .addToggle((toggle) => {
        if (this.plugin.settings.shouldHandleRenames) {
          this.bind(toggle, 'shouldRenameAttachmentFiles');
        } else {
          toggle.setDisabled(true);
          toggle.setValue(false);
        }
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.renamedAttachmentFileName.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.renamedAttachmentFileName.description.part1));
        f.appendText(' ');
        f.createEl('a', {
          href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
          text: t(($) => $.pluginSettingsTab.renamedAttachmentFileName.description.part2)
        });
        f.appendText('.');
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.renamedAttachmentFileName.description.part3));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.pluginSettingsTab.generatedAttachmentFileName.name));
        f.appendText(t(($) => $.pluginSettingsTab.renamedAttachmentFileName.description.part4));
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'renamedAttachmentFileName', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.specialCharacters.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.specialCharacters.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.specialCharacters.description.part2));
      }))
      .addText((text) => {
        this.bind(text, 'specialCharacters', {
          componentToPluginSettingsValueConverter: restoreSpaceCharacter,
          pluginSettingsToComponentValueConverter: showSpaceCharacter,
          shouldResetSettingWhenComponentIsEmpty: false,
          shouldShowPlaceholderForDefaultValues: false
        });

        handleWhitespace(text);
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.specialCharactersReplacement.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.specialCharactersReplacement.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.specialCharactersReplacement.description.part2));
      }))
      .addText((text) => {
        this.bind(text, 'specialCharactersReplacement', {
          shouldResetSettingWhenComponentIsEmpty: false,
          shouldShowPlaceholderForDefaultValues: false
        });
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.shouldConvertPastedImagesToJpeg.name))
      .setDesc(t(($) => $.pluginSettingsTab.shouldConvertPastedImagesToJpeg.description))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldConvertPastedImagesToJpeg');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.jpegQuality.name))
      .setDesc(t(($) => $.pluginSettingsTab.jpegQuality.description))
      .addDropdown((dropDown) => {
        dropDown.addOptions(generateJpegQualityOptions());
        this.bind(dropDown, 'jpegQuality', {
          componentToPluginSettingsValueConverter: (value) => Number(value),
          pluginSettingsToComponentValueConverter: (value) => value.toString()
        });
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.shouldRenameCollectedAttachments.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.shouldRenameCollectedAttachments.description.part1));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.pluginSettingsTab.shouldRenameCollectedAttachments.description.part2));
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.shouldRenameCollectedAttachments.description.part3));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.pluginSettingsTab.collectedAttachmentFileName.name));
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.shouldRenameCollectedAttachments.description.part4));
      }))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldRenameCollectedAttachments');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.collectedAttachmentFileName.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.collectedAttachmentFileName.description.part1));
        f.appendText(' ');
        f.createEl('a', {
          href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#tokens',
          text: t(($) => $.pluginSettingsTab.collectedAttachmentFileName.description.part2)
        });
        f.appendText('.');
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.collectedAttachmentFileName.description.part3));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.pluginSettingsTab.generatedAttachmentFileName.name));
        f.appendText(t(($) => $.pluginSettingsTab.collectedAttachmentFileName.description.part4));
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage(TOKENIZED_STRING_LANGUAGE);
        codeHighlighter.inputEl.addClass('tokenized-string-setting-control');
        this.bind(codeHighlighter, 'collectedAttachmentFileName', bindOptionsWithTrim);
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.collectAttachmentUsedByMultipleNotesMode.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.collectAttachmentUsedByMultipleNotesMode.description.part1));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.skip.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.skip.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.move.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.move.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.copy.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.copy.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.cancel.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.cancel.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.prompt.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.prompt.description));
      }))
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          /* eslint-disable perfectionist/sort-objects -- Need to keep enum order. */
          [CollectAttachmentUsedByMultipleNotesMode.Skip]: t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.skip.displayText),
          [CollectAttachmentUsedByMultipleNotesMode.Move]: t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.move.displayText),
          [CollectAttachmentUsedByMultipleNotesMode.Copy]: t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.copy.displayText),
          [CollectAttachmentUsedByMultipleNotesMode.Cancel]: t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.cancel.displayText),
          [CollectAttachmentUsedByMultipleNotesMode.Prompt]: t(($) => $.pluginSettings.collectAttachmentUsedByMultipleNotesMode.prompt.displayText)
          /* eslint-enable perfectionist/sort-objects -- Need to keep enum order. */
        });
        this.bind(dropdown, 'collectAttachmentUsedByMultipleNotesMode');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.moveAttachmentToProperFolderUsedByMultipleNotesMode.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.moveAttachmentToProperFolderUsedByMultipleNotesMode.description.part1));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.skip.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.skip.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.copyAll.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.copyAll.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.cancel.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.cancel.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.prompt.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.prompt.description));
      }))
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          /* eslint-disable perfectionist/sort-objects -- Need to keep enum order. */
          [MoveAttachmentToProperFolderUsedByMultipleNotesMode.Skip]: t(($) =>
            $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.skip.displayText
          ),
          [MoveAttachmentToProperFolderUsedByMultipleNotesMode.CopyAll]: t(($) =>
            $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.copyAll.displayText
          ),
          [MoveAttachmentToProperFolderUsedByMultipleNotesMode.Cancel]: t(($) =>
            $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.cancel.displayText
          ),
          [MoveAttachmentToProperFolderUsedByMultipleNotesMode.Prompt]: t(($) =>
            $.pluginSettings.moveAttachmentToProperFolderUsedByMultipleNotesMode.prompt.displayText
          )
          /* eslint-enable perfectionist/sort-objects -- Need to keep enum order. */
        });
        this.bind(dropdown, 'moveAttachmentToProperFolderUsedByMultipleNotesMode');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.duplicateNameSeparator.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.duplicateNameSeparator.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.duplicateNameSeparator.description.part2));
        f.appendText(' ');
        appendCodeBlock(f, 'existingFile.pdf');
        f.appendText(t(($) => $.pluginSettingsTab.duplicateNameSeparator.description.part3));
        f.appendText(' ');
        appendCodeBlock(f, 'existingFile 1.pdf');
        f.appendText(', ');
        appendCodeBlock(f, 'existingFile 2.pdf');
        f.appendText(t(($) => $.pluginSettingsTab.duplicateNameSeparator.description.part4));
      }))
      .addText((text) => {
        this.bind(text, 'duplicateNameSeparator', {
          componentToPluginSettingsValueConverter: restoreSpaceCharacter,
          pluginSettingsToComponentValueConverter: showSpaceCharacter
        });

        handleWhitespace(text);
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.emptyAttachmentFolderBehavior.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.emptyAttachmentFolderBehavior.description.part1));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.keep.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.keep.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.delete.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.delete.description));
        f.createEl('br');
        appendCodeBlock(f, t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.deleteWithEmptyParents.displayText));
        f.appendText(' - ');
        f.appendText(t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.deleteWithEmptyParents.description));
      }))
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          /* eslint-disable perfectionist/sort-objects -- Need to keep enum order. */
          [EmptyAttachmentFolderBehavior.Keep]: t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.keep.displayText),
          [EmptyAttachmentFolderBehavior.Delete]: t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.delete.displayText),
          [EmptyAttachmentFolderBehavior.DeleteWithEmptyParents]: t(($) => $.pluginSettings.emptyAttachmentFolderBehavior.deleteWithEmptyParents.displayText)
          /* eslint-enable perfectionist/sort-objects -- Need to keep enum order. */
        });
        this.bind(dropdown, 'emptyAttachmentFolderBehavior');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.shouldDeleteOrphanAttachments.name))
      .setDesc(t(($) => $.pluginSettingsTab.shouldDeleteOrphanAttachments.description))
      .addToggle((toggle) => {
        this.bind(toggle, 'shouldDeleteOrphanAttachments');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.includePaths.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.includePaths.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.includePaths.description.part2));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.includePaths.description.part3));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.regularExpression));
        f.appendText('.');
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.includePaths.description.part4));
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'includePaths');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.excludePaths.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.excludePaths.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.excludePaths.description.part2));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.excludePaths.description.part3));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.regularExpression));
        f.appendText('.');
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.excludePaths.description.part4));
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'excludePaths');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.excludePathsFromAttachmentCollecting.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.excludePathsFromAttachmentCollecting.description.part1));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.pluginSettingsTab.excludePathsFromAttachmentCollecting.description.part2));
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.excludePathsFromAttachmentCollecting.description.part3));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.excludePathsFromAttachmentCollecting.description.part4));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.excludePathsFromAttachmentCollecting.description.part5));
        f.appendText(' ');
        appendCodeBlock(f, t(($) => $.regularExpression));
        f.appendText('.');
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.excludePathsFromAttachmentCollecting.description.part6));
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'excludePathsFromAttachmentCollecting');
      });

    const REGISTER_CUSTOM_TOKENS_DEBOUNCE_IN_MILLISECONDS = 2000;
    const registerCustomTokensDebounced = debounce((customTokensStr: string) => {
      invokeAsyncSafely(async () => {
        Substitutions.registerCustomTokens(customTokensStr);
        await this.revalidate();
      });
    }, REGISTER_CUSTOM_TOKENS_DEBOUNCE_IN_MILLISECONDS);

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.customTokens.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.customTokens.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.customTokens.description.part2));
        f.appendText(' ');
        f.createEl('a', {
          href: 'https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens',
          text: t(($) => $.pluginSettingsTab.customTokens.description.part3)
        });
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.customTokens.description.part4));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.customTokens.description.part5));
      }))
      .addCodeHighlighter((codeHighlighter) => {
        codeHighlighter.setLanguage('javascript');
        codeHighlighter.inputEl.addClass('custom-tokens-setting-control');
        this.bind(codeHighlighter, 'customTokensStr', {
          onChanged: (newValue) => {
            registerCustomTokensDebounced(newValue);
          }
        });
      });
    this.plugin.settingsManager.shouldDebounceCustomTokensValidation = true;

    new SettingEx(this.containerEl)
      .addButton((button) => {
        button.setButtonText(t(($) => $.pluginSettingsTab.resetToSampleCustomTokens.title));
        button.setWarning();
        button.onClick(convertAsyncToSync(async () => {
          if (this.plugin.settings.customTokensStr === SAMPLE_CUSTOM_TOKENS) {
            return;
          }

          if (
            this.plugin.settings.customTokensStr !== '' && !await confirm({
              app: this.plugin.app,
              cancelButtonText: t(($) => $.obsidianDevUtils.buttons.cancel),
              message: t(($) => $.pluginSettingsTab.resetToSampleCustomTokens.message),
              okButtonText: t(($) => $.obsidianDevUtils.buttons.ok),
              title: t(($) => $.pluginSettingsTab.resetToSampleCustomTokens.title)
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
      .setName(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.description.part2));
        f.appendText(' ');
        appendCodeBlock(f, '.md');
        f.appendText(', ');
        appendCodeBlock(f, '.canvas');
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.description.part3));
        f.appendText(' ');
        appendCodeBlock(f, '.base');
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.description.part4));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.description.part5));
        f.appendText(' ');
        appendCodeBlock(f, '.foo.md');
        f.appendText(', ');
        appendCodeBlock(f, '.bar.canvas');
        f.appendText(', ');
        appendCodeBlock(f, '.baz.base');
        f.appendText(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.description.part6));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.treatAsAttachmentExtensions.description.part7));
      }))
      .addMultipleText((multipleText) => {
        this.bind(multipleText, 'treatAsAttachmentExtensions');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.timeoutInSeconds.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.timeoutInSeconds.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.timeoutInSeconds.description.part2));
        f.appendText(' ');
        appendCodeBlock(f, '0');
        f.appendText(' ');
        f.appendText(t(($) => $.pluginSettingsTab.timeoutInSeconds.description.part3));
      }))
      .addNumber((number) => {
        number.setMin(0);
        this.bind(number, 'timeoutInSeconds');
      });

    new SettingEx(this.containerEl)
      .setName(t(($) => $.pluginSettingsTab.defaultImageSize.name))
      .setDesc(createFragment((f) => {
        f.appendText(t(($) => $.pluginSettingsTab.defaultImageSize.description.part1));
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.defaultImageSize.description.part2));
        f.appendText(' (');
        appendCodeBlock(f, '300px');
        f.appendText(') ');
        f.appendText(t(($) => $.pluginSettingsTab.defaultImageSize.description.part3));
        f.appendText(' (');
        appendCodeBlock(f, '50%');
        f.appendText(').');
        f.createEl('br');
        f.appendText(t(($) => $.pluginSettingsTab.defaultImageSize.description.part4));
      }))
      .addText((text) => {
        this.bind(text, 'defaultImageSize');
      })
      .addDropdown((dropdown) => {
        dropdown.selectEl.addClass('default-image-size-dimension-setting-control');
        dropdown.addOptions({
          /* eslint-disable perfectionist/sort-objects -- Need to keep enum order. */
          [DefaultImageSizeDimension.Width]: t(($) => $.pluginSettings.defaultImageSizeDimension.width),
          [DefaultImageSizeDimension.Height]: t(($) => $.pluginSettings.defaultImageSizeDimension.height)
          /* eslint-enable perfectionist/sort-objects -- Need to keep enum order. */
        });
        this.bind(dropdown, 'defaultImageSizeDimension');
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

function handleWhitespace(text: TextComponent): void {
  text.inputEl.addEventListener('input', () => {
    const start = text.inputEl.selectionStart ?? 0;
    const end = text.inputEl.selectionEnd ?? 0;
    text.inputEl.value = showSpaceCharacter(text.inputEl.value);
    text.inputEl.setSelectionRange(start, end);
  });
}

function restoreSpaceCharacter(str: string): string {
  return str.replaceAll(VISIBLE_SPACE_CHARACTER, ' ');
}

function showSpaceCharacter(str: string): string {
  return str.replaceAll(' ', VISIBLE_SPACE_CHARACTER);
}
