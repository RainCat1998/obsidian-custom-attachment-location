import type { App } from 'obsidian';
import type { PromiseResolve } from 'obsidian-dev-utils/Async';

import {
  Modal,
  Setting
} from 'obsidian';
import { invokeAsyncSafely } from 'obsidian-dev-utils/Async';
import {
  createElAsync,
  createFragmentAsync
} from 'obsidian-dev-utils/HTMLElement';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import { renderInternalLink } from 'obsidian-dev-utils/obsidian/Markdown';

import { CollectAttachmentUsedByMultipleNotesMode } from '../PluginSettings.ts';

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
    private readonly resolve: PromiseResolve<CollectAttachmentUsedByMultipleNotesModalResult>,
    private readonly isCancelMode: boolean
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
    invokeAsyncSafely(() => this.onOpenAsync());
  }

  public async onOpenAsync(): Promise<void> {
    super.onOpen();
    new Setting(this.contentEl)
      .setName(t(($) => $.collectAttachmentUsedByMultipleNotesModal.heading))
      .setHeading();

    this.contentEl.appendChild(
      await createFragmentAsync(async (f) => {
        f.appendText(t(($) => $.collectAttachmentUsedByMultipleNotesModal.content.part1));
        f.appendText(' ');
        f.appendChild(await renderInternalLink(this.app, this.attachmentPath));
        f.appendText(' ');
        f.appendText(t(($) => $.collectAttachmentUsedByMultipleNotesModal.content.part2));
        f.appendChild(
          await createElAsync('ul', {}, async (ul) => {
            for (const backlink of this.backlinks) {
              ul.appendChild(
                await createElAsync('li', {}, async (li) => {
                  li.appendChild(await renderInternalLink(this.app, backlink));
                })
              );
            }
          })
        );
      })
    );

    let shouldUseSameActionForOtherProblematicAttachments = false;

    if (!this.isCancelMode) {
      new Setting(this.contentEl)
        .setName(t(($) => $.collectAttachmentUsedByMultipleNotesModal.shouldUseSameActionForOtherProblematicAttachmentsToggle))
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
            this.select(CollectAttachmentUsedByMultipleNotesMode.Skip, shouldUseSameActionForOtherProblematicAttachments);
          });
        })
        .addButton((button) => {
          button.setButtonText(t(($) => $.buttons.move));
          button.onClick(() => {
            this.select(CollectAttachmentUsedByMultipleNotesMode.Move, shouldUseSameActionForOtherProblematicAttachments);
          });
        })
        .addButton((button) => {
          button.setButtonText(t(($) => $.buttons.copy));
          button.onClick(() => {
            this.select(CollectAttachmentUsedByMultipleNotesMode.Copy, shouldUseSameActionForOtherProblematicAttachments);
          });
        });
    }

    buttonsSetting
      .addButton((button) => {
        button.setButtonText(t(($) => $.obsidianDevUtils.buttons.cancel));
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

export function selectMode(
  app: App,
  attachmentPath: string,
  backlinks: string[],
  isCancelMode?: boolean
): Promise<CollectAttachmentUsedByMultipleNotesModalResult> {
  return new Promise((resolve) => {
    const modal = new CollectAttachmentUsedByMultipleNotesModal(app, attachmentPath, backlinks, resolve, isCancelMode ?? false);
    modal.open();
  });
}
