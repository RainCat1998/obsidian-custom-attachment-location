import type { TFile } from 'obsidian';
import type { PromiseResolve } from 'obsidian-dev-utils/Async';
import type { EmbedComponent } from 'obsidian-typings';

import {
  ButtonComponent,
  Modal,
  TextComponent
} from 'obsidian';
import {
  convertAsyncToSync,
  invokeAsyncSafely
} from 'obsidian-dev-utils/Async';
import { CssClass } from 'obsidian-dev-utils/CssClass';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import { addPluginCssClasses } from 'obsidian-dev-utils/obsidian/Plugin/PluginContext';

import type { TokenEvaluatorContext } from './TokenEvaluatorContext.ts';

interface PromptWithPreviewModalOptions {
  ctx: TokenEvaluatorContext;
  valueValidator: (value: string) => Promise<null | string>;
}

class PreviewModal extends Modal {
  private embedComponent?: EmbedComponent;
  private tempFile?: TFile;

  public constructor(private readonly options: PromptWithPreviewModalOptions) {
    super(options.ctx.app);
    addPluginCssClasses(this.containerEl, 'preview-modal');
  }

  public override onClose(): void {
    super.onClose();
    this.embedComponent?.unload();
    invokeAsyncSafely(async () => {
      if (this.tempFile) {
        await this.app.vault.delete(this.tempFile);
      }
    });
  }

  public override onOpen(): void {
    super.onOpen();
    invokeAsyncSafely(this.onOpenAsync.bind(this));
  }

  private async onOpenAsync(): Promise<void> {
    const embeddableCreator = this.app.embedRegistry.embedByExtension[this.options.ctx.originalAttachmentFileExtension];

    if (!embeddableCreator || !this.options.ctx.attachmentFileContent) {
      return;
    }

    const fullFileName = `${this.options.ctx.originalAttachmentFileName}.${this.options.ctx.originalAttachmentFileExtension}`;

    this.titleEl.setText(t(($) => $.promptWithPreviewModal.previewModal.title, { fullFileName }));

    const tempPath = `__temp${String(Date.now())}__${fullFileName}`;
    this.tempFile = await this.app.vault.createBinary(tempPath, this.options.ctx.attachmentFileContent);

    const previewContainer = this.contentEl.createDiv('preview-container');

    this.embedComponent = embeddableCreator({
      app: this.app,
      containerEl: previewContainer
    }, this.tempFile);

    this.embedComponent.load();
    this.embedComponent.loadFile();
  }
}

class PromptWithPreviewModal extends Modal {
  private isOkClicked = false;
  private value: string;

  public constructor(private readonly options: PromptWithPreviewModalOptions, private readonly resolve: PromiseResolve<null | string>) {
    super(options.ctx.app);
    addPluginCssClasses(this.containerEl, CssClass.PromptModal);
    this.value = options.ctx.originalAttachmentFileName;
  }

  public override onClose(): void {
    super.onClose();
    this.resolve(this.isOkClicked ? this.value : null);
  }

  public override onOpen(): void {
    super.onOpen();

    const title = createFragment((f) => {
      f.appendText(t(($) => $.promptWithPreviewModal.title));
      f.createEl('br');
      f.appendText(this.options.ctx.fullTemplate.slice(0, this.options.ctx.tokenStartOffset));
      f.createSpan({ cls: 'highlighted-token', text: this.options.ctx.tokenWithFormat });
      f.appendText(this.options.ctx.fullTemplate.slice(this.options.ctx.tokenEndOffset));
    });

    this.titleEl.setText(title);
    const textComponent = new TextComponent(this.contentEl);
    const inputEl = textComponent.inputEl;

    const validate = async (): Promise<void> => {
      const errorMessage = await this.options.valueValidator(inputEl.value) as string | undefined;
      inputEl.setCustomValidity(errorMessage ?? '');
      inputEl.reportValidity();
    };

    textComponent.setValue(this.value);
    textComponent.setPlaceholder(t(($) => $.promptWithPreviewModal.title));
    inputEl.addClass(CssClass.TextBox);
    textComponent.onChange((newValue) => {
      this.value = newValue;
    });
    inputEl.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.handleOk(event, textComponent);
      } else if (event.key === 'Escape') {
        this.close();
      }
    });
    inputEl.addEventListener('input', convertAsyncToSync(validate));
    inputEl.addEventListener('focus', convertAsyncToSync(validate));
    invokeAsyncSafely(validate);
    const okButton = new ButtonComponent(this.contentEl);
    okButton.setButtonText(t(($) => $.obsidianDevUtils.buttons.ok));
    okButton.setCta();
    okButton.onClick((event) => {
      this.handleOk(event, textComponent);
    });
    okButton.setClass(CssClass.OkButton);
    const cancelButton = new ButtonComponent(this.contentEl);
    cancelButton.setButtonText(t(($) => $.obsidianDevUtils.buttons.cancel));
    cancelButton.onClick(this.close.bind(this));
    cancelButton.setClass(CssClass.CancelButton);

    const previewButton = new ButtonComponent(this.contentEl);
    previewButton.setButtonText(t(($) => $.buttons.previewAttachmentFile));
    previewButton.onClick(this.preview.bind(this));

    const embeddableCreator = this.app.embedRegistry.embedByExtension[this.options.ctx.originalAttachmentFileExtension];

    if (!this.options.ctx.attachmentFileContent || !embeddableCreator) {
      previewButton.setDisabled(true);
    }
  }

  private handleOk(event: Event, textComponent: TextComponent): void {
    event.preventDefault();
    if (!textComponent.inputEl.checkValidity()) {
      return;
    }

    this.isOkClicked = true;
    this.close();
  }

  private preview(): void {
    const previewModal = new PreviewModal(this.options);
    previewModal.open();
  }
}

export function promptWithPreview(options: PromptWithPreviewModalOptions): Promise<null | string> {
  return new Promise((resolve) => {
    const modal = new PromptWithPreviewModal(options, resolve);
    modal.open();
  });
}
