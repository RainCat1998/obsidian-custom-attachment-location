import type { App } from 'obsidian';
import type { PromiseResolve } from 'obsidian-dev-utils/Async';

import {
  Modal,
  Setting
} from 'obsidian';
import { appendCodeBlock } from 'obsidian-dev-utils/HTMLElement';

import { CollectAttachmentUsedByMultipleNotesMode } from './PluginSettings.ts';

interface CollectAttachmentUsedByMultipleNotesModalResult {
  mode: CollectAttachmentUsedByMultipleNotesMode;
  shouldUseSameActionForOtherProblematicAttachments: boolean;
}

class CollectAttachmentUsedByMultipleNotesModal extends Modal {
  private isSelected = false;

  public constructor(
    app: App,
    private readonly attachmentPath: string,
    private readonly backlinks: string[],
    private readonly resolve: PromiseResolve<CollectAttachmentUsedByMultipleNotesModalResult>
  ) {
    super(app);
  }

  public override onClose(): void {
    if (!this.isSelected) {
      this.select(CollectAttachmentUsedByMultipleNotesMode.Cancel, false);
    }
  }

  public override onOpen(): void {
    super.onOpen();
    new Setting(this.contentEl)
      .setName('Collecting attachment used by multiple notes')
      .setHeading();

    this.contentEl.appendChild(createFragment((f) => {
      f.appendText('Attachment ');
      appendCodeBlock(f, this.attachmentPath);
      f.appendText(' is referenced by multiple notes.');
      f.createEl('ul', {}, (ul) => {
        for (const backlink of this.backlinks) {
          ul.createEl('li', {}, (li) => [
            li.appendChild(createFragment((f2) => {
              appendCodeBlock(f2, backlink);
            }))
          ]);
        }
      });
    }));

    let shouldUseSameActionForOtherProblematicAttachments = false;

    new Setting(this.contentEl)
      .setName('Should use the same action for other problematic attachments')
      .addToggle((toggle) => {
        toggle.setValue(false);
        toggle.onChange((value) => {
          shouldUseSameActionForOtherProblematicAttachments = value;
        });
      });

    new Setting(this.contentEl)
      .addButton((button) => {
        button.setButtonText('Skip');
        button.onClick(() => {
          this.select(CollectAttachmentUsedByMultipleNotesMode.Skip, shouldUseSameActionForOtherProblematicAttachments);
        });
      })
      .addButton((button) => {
        button.setButtonText('Move');
        button.onClick(() => {
          this.select(CollectAttachmentUsedByMultipleNotesMode.Move, shouldUseSameActionForOtherProblematicAttachments);
        });
      })
      .addButton((button) => {
        button.setButtonText('Copy');
        button.onClick(() => {
          this.select(CollectAttachmentUsedByMultipleNotesMode.Copy, shouldUseSameActionForOtherProblematicAttachments);
        });
      })
      .addButton((button) => {
        button.setButtonText('Cancel');
        button.onClick(() => {
          this.select(CollectAttachmentUsedByMultipleNotesMode.Cancel, shouldUseSameActionForOtherProblematicAttachments);
        });
      });
  }

  private select(mode: CollectAttachmentUsedByMultipleNotesMode, shouldUseSameActionForOtherProblematicAttachments: boolean): void {
    this.isSelected = true;
    this.resolve({ mode, shouldUseSameActionForOtherProblematicAttachments });
    this.close();
  }
}

export function selectMode(app: App, attachmentPath: string, backlinks: string[]): Promise<CollectAttachmentUsedByMultipleNotesModalResult> {
  return new Promise((resolve) => {
    const modal = new CollectAttachmentUsedByMultipleNotesModal(app, attachmentPath, backlinks, resolve);
    modal.open();
  });
}
