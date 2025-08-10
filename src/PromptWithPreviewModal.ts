import type {
  App,
  TFile
} from 'obsidian';
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
import { addPluginCssClasses } from 'obsidian-dev-utils/obsidian/Plugin/PluginContext';

interface PromptWithPreviewModalOptions {
  app: App;
  attachmentFileContent: ArrayBuffer | undefined;
  originalAttachmentFileExtension: string;
  originalAttachmentFileName: string;
  valueValidator: (value: string) => Promise<null | string>;
}

class PreviewModal extends Modal {
  private embedComponent!: EmbedComponent;
  private tempFile!: TFile;

  public constructor(private readonly options: PromptWithPreviewModalOptions) {
    super(options.app);
    addPluginCssClasses(this.containerEl, 'preview-modal');
  }

  public override onClose(): void {
    super.onClose();
    this.embedComponent.unload();
    invokeAsyncSafely(async () => {
      await this.app.vault.delete(this.tempFile);
    });
  }

  public override onOpen(): void {
    super.onOpen();
    invokeAsyncSafely(this.onOpenAsync.bind(this));
  }

  private async onOpenAsync(): Promise<void> {
    const embeddableCreator = this.app.embedRegistry.embedByExtension[this.options.originalAttachmentFileExtension];

    if (!embeddableCreator || !this.options.attachmentFileContent) {
      return;
    }

    const fullFileName = `${this.options.originalAttachmentFileName}.${this.options.originalAttachmentFileExtension}`;

    this.titleEl.setText(`Preview attachment file '${fullFileName}'`);

    const tempPath = `__temp${String(Date.now())}__${fullFileName}`;
    this.tempFile = await this.app.vault.createBinary(tempPath, this.options.attachmentFileContent);

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
    super(options.app);
    addPluginCssClasses(this.containerEl, CssClass.PromptModal);
    this.value = options.originalAttachmentFileName;
  }

  public override onClose(): void {
    super.onClose();
    this.resolve(this.isOkClicked ? this.value : null);
  }

  public override onOpen(): void {
    // eslint-disable-next-line no-template-curly-in-string
    const TITLE = 'Provide a value for ${prompt} template';

    super.onOpen();

    this.titleEl.setText(TITLE);
    const textComponent = new TextComponent(this.contentEl);
    const inputEl = textComponent.inputEl;

    const validate = async (): Promise<void> => {
      const errorMessage = await this.options.valueValidator(inputEl.value) as string | undefined;
      inputEl.setCustomValidity(errorMessage ?? '');
      inputEl.reportValidity();
    };

    textComponent.setValue(this.value);
    textComponent.setPlaceholder(TITLE);
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
    okButton.setButtonText('OK');
    okButton.setCta();
    okButton.onClick((event) => {
      this.handleOk(event, textComponent);
    });
    okButton.setClass(CssClass.OkButton);
    const cancelButton = new ButtonComponent(this.contentEl);
    cancelButton.setButtonText('Cancel');
    cancelButton.onClick(this.close.bind(this));
    cancelButton.setClass(CssClass.CancelButton);

    const previewButton = new ButtonComponent(this.contentEl);
    previewButton.setButtonText('Preview attachment file');
    previewButton.onClick(this.preview.bind(this));

    const embeddableCreator = this.app.embedRegistry.embedByExtension[this.options.originalAttachmentFileExtension];

    if (!this.options.attachmentFileContent || !embeddableCreator) {
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
