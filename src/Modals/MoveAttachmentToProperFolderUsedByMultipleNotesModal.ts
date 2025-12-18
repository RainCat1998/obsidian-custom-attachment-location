import type { App } from 'obsidian';
import type { PromiseResolve } from 'obsidian-dev-utils/Async';

import {
  Modal,
  Setting
} from 'obsidian';
import { invokeAsyncSafely } from 'obsidian-dev-utils/Async';
import { createFragmentAsync } from 'obsidian-dev-utils/HTMLElement';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import { renderInternalLink } from 'obsidian-dev-utils/obsidian/Markdown';

import { MoveAttachmentToProperFolderUsedByMultipleNotesMode } from '../PluginSettings.ts';

interface MoveAttachmentToProperFolderUsedByMultipleNotesModalResult {
  backlinksToCopy: string[];
  mode: MoveAttachmentToProperFolderUsedByMultipleNotesMode;
  shouldUseSameActionForOtherProblematicAttachments: boolean;
}

class MoveAttachmentToProperFolderUsedByMultipleNotesModal extends Modal {
  private isSelected = false;
  private readonly selectedBacklinks = new Set<string>();

  public constructor(
    app: App,
    private readonly attachmentPath: string,
    private readonly backlinks: string[],
    private readonly resolve: PromiseResolve<MoveAttachmentToProperFolderUsedByMultipleNotesModalResult>,
    private readonly isCancelMode: boolean
  ) {
    super(app);
  }

  public override onClose(): void {
    if (!this.isSelected) {
      this.select(MoveAttachmentToProperFolderUsedByMultipleNotesMode.Cancel, false);
    }
  }

  public override onOpen(): void {
    super.onOpen();
    invokeAsyncSafely(() => this.onOpenAsync());
  }

  public async onOpenAsync(): Promise<void> {
    new Setting(this.contentEl)
      .setName(t(($) => $.moveAttachmentToProperFolderUsedByMultipleNotesModal.heading))
      .setHeading();

    this.contentEl.appendChild(
      await createFragmentAsync(async (f) => {
        f.appendText(t(($) => $.moveAttachmentToProperFolderUsedByMultipleNotesModal.content.part1));
        f.appendText(' ');
        f.appendChild(await renderInternalLink(this.app, this.attachmentPath));
        f.appendText(' ');
        f.appendText(t(($) => $.moveAttachmentToProperFolderUsedByMultipleNotesModal.content.part2));
        f.createEl('br');
        f.appendText(t(($) => $.moveAttachmentToProperFolderUsedByMultipleNotesModal.content.part3));
        f.createEl('br');
        for (const backlink of this.backlinks) {
          this.selectedBacklinks.add(backlink);
          f.createEl('br');
          f.createEl('input', { attr: { checked: true }, type: 'checkbox' });
          f.appendChild(await renderInternalLink(this.app, backlink));
        }
        f.createEl('br');
        f.createEl('br');
      })
    );

    let shouldUseSameActionForOtherProblematicAttachments = false;

    if (!this.isCancelMode) {
      new Setting(this.contentEl)
        .setName(t(($) => $.moveAttachmentToProperFolderUsedByMultipleNotesModal.shouldUseSameActionForOtherProblematicAttachmentsToggle))
        .addToggle((toggle) => {
          toggle.setValue(false);
          toggle.onChange((value) => {
            shouldUseSameActionForOtherProblematicAttachments = value;
          });
        });
    }

    const buttonsSetting = new Setting(this.contentEl);
    if (!this.isCancelMode) {
      buttonsSetting
        .addButton((button) => {
          button.setButtonText(t(($) => $.buttons.skip));
          button.onClick(() => {
            this.select(MoveAttachmentToProperFolderUsedByMultipleNotesMode.Skip, shouldUseSameActionForOtherProblematicAttachments);
          });
        })
        .addButton((button) => {
          button.setButtonText(t(($) => $.buttons.copyAll));
          button.onClick(() => {
            this.select(MoveAttachmentToProperFolderUsedByMultipleNotesMode.CopyAll, shouldUseSameActionForOtherProblematicAttachments);
          });
        })
        .addButton((button) => {
          button.setButtonText(t(($) => $.buttons.select));
          button.onClick(() => {
            this.select(MoveAttachmentToProperFolderUsedByMultipleNotesMode.Prompt, shouldUseSameActionForOtherProblematicAttachments);
          });
        });
    }

    buttonsSetting
      .addButton((button) => {
        button.setButtonText(t(($) => $.obsidianDevUtils.buttons.cancel));
        button.onClick(() => {
          this.select(MoveAttachmentToProperFolderUsedByMultipleNotesMode.Cancel, shouldUseSameActionForOtherProblematicAttachments);
        });
      });
  }

  private select(mode: MoveAttachmentToProperFolderUsedByMultipleNotesMode, shouldUseSameActionForOtherProblematicAttachments: boolean): void {
    this.isSelected = true;
    this.resolve({
      backlinksToCopy: Array.from(this.selectedBacklinks).sort((a, b) => a.localeCompare(b)),
      mode,
      shouldUseSameActionForOtherProblematicAttachments
    });
    this.close();
  }
}

export function selectMode(
  app: App,
  attachmentPath: string,
  backlinks: string[],
  isCancelMode?: boolean
): Promise<MoveAttachmentToProperFolderUsedByMultipleNotesModalResult> {
  return new Promise((resolve) => {
    const modal = new MoveAttachmentToProperFolderUsedByMultipleNotesModal(app, attachmentPath, backlinks, resolve, isCancelMode ?? false);
    modal.open();
  });
}
