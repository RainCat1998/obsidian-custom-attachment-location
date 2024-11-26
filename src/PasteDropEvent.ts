import { webUtils } from 'electron';
import { convertAsyncToSync } from 'obsidian-dev-utils/Async';
import {
  blobToArrayBuffer,
  blobToJpegArrayBuffer,
  isImageFile
} from 'obsidian-dev-utils/Blob';
import { isNote } from 'obsidian-dev-utils/obsidian/FileSystem';
import {
  basename,
  extname,
  makeFileName
} from 'obsidian-dev-utils/Path';

import type { CustomAttachmentLocationPlugin } from './CustomAttachmentLocationPlugin.ts';

import {
  getPastedFileName,
  replaceWhitespace
} from './AttachmentPath.ts';
import { createSubstitutionsFromPath } from './Substitutions.ts';

enum TargetType {
  Canvas = 'Canvas',
  Note = 'Note',
  Unsupported = 'Unsupported'
}

type HandledEvent = {
  handled?: boolean;
} & Event;

interface PastedEntry {
  file?: File;
  textPromise?: Promise<string>;
  type: string;
}

abstract class EventWrapper {
  protected constructor(
    protected readonly event: ClipboardEvent | DragEvent,
    private readonly eventType: string,
    protected readonly plugin: CustomAttachmentLocationPlugin
  ) { }

  public async handle(): Promise<void> {
    let handledEvent = this.event as HandledEvent;

    if (handledEvent.handled) {
      return;
    }

    const draggable = this.plugin.app.dragManager.draggable;

    const targetType = this.getTargetType();

    if (targetType === TargetType.Unsupported) {
      return;
    }

    console.debug(`Handle ${targetType} ${this.eventType}`);

    const noteFile = this.plugin.app.workspace.getActiveFile();

    if (!noteFile || !isNote(noteFile)) {
      return;
    }

    const dataTransfer = this.getDataTransfer();

    if (!dataTransfer) {
      return;
    }

    if (!this.event.target) {
      return;
    }

    this.event.preventDefault();
    this.event.stopImmediatePropagation();

    const pastedEntries: PastedEntry[] = Array.from(dataTransfer.items).map((item) => {
      const type = item.type;
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (!file) {
          throw new Error('Could not get file from item');
        }
        return {
          file,
          type
        };
      } else if (item.kind === 'string') {
        const textPromise = new Promise<string>((resolve) => {
          item.getAsString((text) => {
            resolve(text);
          });
        });
        return {
          textPromise,
          type
        };
      } else {
        throw new Error(`Unsupported item kind ${item.kind}`);
      }
    });

    const newDataTransfer = new DataTransfer();

    for (const entry of pastedEntries) {
      if (entry.textPromise) {
        newDataTransfer.items.add(await entry.textPromise, entry.type);
      } else if (entry.file) {
        let extension = extname(entry.file.name).slice(1);
        const originalCopiedFileName = basename(entry.file.name, '.' + extension);

        let fileArrayBuffer: ArrayBuffer;
        if (this.shouldConvertImages() && isImageFile(entry.file)) {
          fileArrayBuffer = await blobToJpegArrayBuffer(entry.file, this.plugin.settingsCopy.jpegQuality);
          extension = 'jpg';
        } else {
          fileArrayBuffer = await blobToArrayBuffer(entry.file);
        }

        const shouldRename = this.shouldRenameAttachments(entry.file);

        let filename = shouldRename ? await getPastedFileName(this.plugin, createSubstitutionsFromPath(noteFile.path, originalCopiedFileName)) : originalCopiedFileName;
        filename = replaceWhitespace(this.plugin, filename);

        const filePropertyBag: FilePropertyBag = { type: entry.type.replace('image/', 'image-override/') };
        if (!shouldRename) {
          filePropertyBag.lastModified = entry.file.lastModified;
        }
        const renamedFile = new File([new Blob([fileArrayBuffer])], makeFileName(filename, extension), filePropertyBag);
        if (!shouldRename) {
          Object.defineProperty(renamedFile, 'path', { value: getFilePath(entry.file) });
        }
        newDataTransfer.items.add(renamedFile);
      }
    }

    handledEvent = this.cloneWithNewDataTransfer(newDataTransfer) as HandledEvent;
    handledEvent.handled = true;

    this.plugin.app.dragManager.draggable = draggable;
    this.event.target.dispatchEvent(handledEvent);
  }

  protected abstract cloneWithNewDataTransfer(dataTransfer: DataTransfer): ClipboardEvent | DragEvent;
  protected abstract getDataTransfer(): DataTransfer | null;
  protected abstract shouldConvertImages(): boolean;
  protected abstract shouldRenameAttachments(file: File): boolean;

  private getTargetType(): TargetType {
    if (!(this.event.target instanceof HTMLElement)) {
      return TargetType.Unsupported;
    }

    if (this.plugin.app.workspace.activeEditor?.metadataEditor?.contentEl.contains(this.event.target)) {
      return TargetType.Unsupported;
    }

    if (this.plugin.app.workspace.activeEditor?.editor?.containerEl.contains(this.event.target)) {
      return TargetType.Note;
    }

    if (this.event.target.closest('.canvas-wrapper')) {
      if (this.event.target.isContentEditable) {
        return TargetType.Unsupported;
      }
      return TargetType.Canvas;
    }

    const canvasView = this.plugin.app.workspace.getActiveFileView();

    if (this.event.target.matches('body') && canvasView?.getViewType() === 'canvas' && canvasView.containerEl.closest('.mod-active')) {
      return TargetType.Canvas;
    }

    return TargetType.Unsupported;
  }
}

class DropEventWrapper extends EventWrapper {
  public constructor(
    protected override readonly event: DragEvent,
    plugin: CustomAttachmentLocationPlugin
  ) {
    super(event, 'Drop', plugin);
  }

  protected override cloneWithNewDataTransfer(dataTransfer: DataTransfer): DragEvent {
    return new DragEvent('drop', {
      bubbles: this.event.bubbles,
      cancelable: this.event.cancelable,
      clientX: this.event.clientX,
      clientY: this.event.clientY,
      composed: this.event.composed,
      dataTransfer
    });
  }

  protected override getDataTransfer(): DataTransfer | null {
    return this.event.dataTransfer;
  }

  protected override shouldConvertImages(): boolean {
    return this.plugin.settingsCopy.convertImagesToJpeg && this.plugin.settingsCopy.convertImagesOnDragAndDrop;
  }

  protected override shouldRenameAttachments(file: File): boolean {
    if (this.plugin.settingsCopy.renameOnlyImages && !isImageFile(file)) {
      return false;
    }

    return this.plugin.settingsCopy.renameAttachmentsOnDragAndDrop;
  }
}

class PasteEventWrapper extends EventWrapper {
  public constructor(
    protected override readonly event: ClipboardEvent,
    plugin: CustomAttachmentLocationPlugin
  ) {
    super(event, 'Paste', plugin);
  }

  protected override cloneWithNewDataTransfer(dataTransfer: DataTransfer): ClipboardEvent {
    return new ClipboardEvent('paste', {
      bubbles: this.event.bubbles,
      cancelable: this.event.cancelable,
      clipboardData: dataTransfer,
      composed: this.event.composed
    });
  }

  protected override getDataTransfer(): DataTransfer | null {
    return this.event.clipboardData;
  }

  protected override shouldConvertImages(): boolean {
    return this.plugin.settingsCopy.convertImagesToJpeg;
  }

  protected override shouldRenameAttachments(file: File): boolean {
    if (this.plugin.settingsCopy.renameOnlyImages && !isImageFile(file)) {
      return false;
    }
    return getFilePath(file) === '' || this.plugin.settingsCopy.renamePastedFilesWithKnownNames;
  }
}

export function registerPasteDropEventHandlers(plugin: CustomAttachmentLocationPlugin): void {
  const listener = convertAsyncToSync(async (event: ClipboardEvent | DragEvent) => handlePasteAndDrop(plugin, event));
  registerHandlersForWindow(window);
  plugin.app.workspace.on('window-open', (_, window) => {
    registerHandlersForWindow(window);
  });

  function registerHandlersForWindow(window: Window): void {
    plugin.registerDomEvent(window.document, 'paste', listener, { capture: true });
    plugin.registerDomEvent(window.document, 'drop', listener, { capture: true });
  }
}

function getFilePath(file: File): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return file.path || (webUtils?.getPathForFile(file) ?? '');
}

async function handlePasteAndDrop(plugin: CustomAttachmentLocationPlugin, event: ClipboardEvent | DragEvent): Promise<void> {
  const eventWrapper = event.constructor.name === 'ClipboardEvent' ? new PasteEventWrapper(event as ClipboardEvent, plugin) : new DropEventWrapper(event as DragEvent, plugin);
  await eventWrapper.handle();
}
