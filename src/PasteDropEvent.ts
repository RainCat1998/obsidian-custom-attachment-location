import { posix } from "@jinder/path";
const {
  basename,
  extname
} = posix;

import {
  blobToArrayBuffer,
  blobToJpegArrayBuffer,
  isImageFile
} from "./Blob.ts";
import {
  getAttachmentFolderFullPath,
  getPastedFileName,
  makeFileName
} from "./AttachmentPath.ts";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import {
  createFolderSafe,
  isNote
} from "./Vault.ts";
import { convertAsyncToSync } from "./Async.ts";
import { createSubstitutionsFromPath } from "./Substitutions.ts";

type HandledEvent = Event & {
  handled?: boolean
};

type PastedEntry = {
  file?: File;
  textPromise?: Promise<string>;
  type: string;
};

export function registerPasteDropEventHandlers(plugin: CustomAttachmentLocationPlugin): void {
  const listener = convertAsyncToSync(async (event: ClipboardEvent | DragEvent) => handlePasteAndDrop(plugin, event));
  plugin.registerDomEvent(document, "paste", listener, { capture: true });
  plugin.registerDomEvent(document, "drop", listener, { capture: true });
}

async function handlePasteAndDrop(plugin: CustomAttachmentLocationPlugin, event: ClipboardEvent | DragEvent): Promise<void> {
  const eventWrapper = event instanceof ClipboardEvent ? new PasteEventWrapper(event, plugin) : new DropEventWrapper(event, plugin);
  await eventWrapper.handle();
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

    if (!targetType) {
      return;
    }

    console.debug(`Handle ${targetType} ${this.eventType}`);

    const noteFile = this.plugin.app.workspace.getActiveFile();

    if (!isNote(noteFile)) {
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
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (!file) {
          throw new Error("Could not get file from item");
        }
        return {
          file,
          type
        };
      } else if (item.kind === "string") {
        const textPromise = new Promise<string>(resolve => item.getAsString(text => resolve(text)));
        return {
          textPromise,
          type
        };
      } else {
        throw new Error(`Unsupported item kind ${item.kind}`);
      }
    });

    const newDataTransfer = new DataTransfer();

    let hasFiles = false;

    for (const entry of pastedEntries) {
      if (entry.textPromise) {
        newDataTransfer.items.add(await entry.textPromise, entry.type);
      } else if (entry.file) {
        let extension = extname(entry.file.name).slice(1);
        const originalCopiedFileName = basename(entry.file.name, "." + extension);

        let fileArrayBuffer: ArrayBuffer;
        if (this.shouldConvertImages() && isImageFile(entry.file)) {
          fileArrayBuffer = await blobToJpegArrayBuffer(entry.file, this.plugin.settings.jpegQuality);
          extension = "jpg";
        } else {
          fileArrayBuffer = await blobToArrayBuffer(entry.file);
        }

        const filename = this.shouldRenameAttachments(entry.file) ? await getPastedFileName(this.plugin, createSubstitutionsFromPath(noteFile.path, originalCopiedFileName)) : originalCopiedFileName;

        const renamedFile = new File([new Blob([fileArrayBuffer])], makeFileName(filename, extension), { type: "application/octet-stream" });
        newDataTransfer.items.add(renamedFile);
        hasFiles = true;
      }
    }

    if (hasFiles) {
      const attachmentsFolderPath = await getAttachmentFolderFullPath(this.plugin, createSubstitutionsFromPath(noteFile.path));
      await createFolderSafe(this.plugin.app, attachmentsFolderPath, this.plugin.settings.keepEmptyAttachmentFolders);
    }

    handledEvent = this.cloneWithNewDataTransfer(newDataTransfer) as HandledEvent;
    handledEvent.handled = true;

    this.plugin.app.dragManager.draggable = draggable;
    this.event.target.dispatchEvent(handledEvent);
  }

  protected abstract getDataTransfer(): DataTransfer | null;
  protected abstract cloneWithNewDataTransfer(dataTransfer: DataTransfer): ClipboardEvent | DragEvent;
  protected abstract shouldRenameAttachments(file: File): boolean;
  protected abstract shouldConvertImages(): boolean;

  private getTargetType(): string | null {
    if (!(this.event.target instanceof HTMLElement)) {
      return null;
    }

    if (this.plugin.app.workspace.activeEditor?.editor?.containerEl.contains(this.event.target)) {
      return "Note";
    }

    if (this.event.target.closest(".canvas-wrapper")) {
      return "Canvas";
    }

    const canvasView = this.plugin.app.workspace.getActiveFileView();

    if (this.event.target.matches("body") && canvasView?.getViewType() === "canvas" && canvasView.containerEl.closest(".mod-active")) {
      return "Canvas";
    }

    return null;
  }

}

class PasteEventWrapper extends EventWrapper {
  public constructor(
    protected override readonly event: ClipboardEvent,
    plugin: CustomAttachmentLocationPlugin
  ) {
    super(event, "Paste", plugin);
  }

  protected override getDataTransfer(): DataTransfer | null {
    return this.event.clipboardData;
  }

  protected override cloneWithNewDataTransfer(dataTransfer: DataTransfer): ClipboardEvent {
    return new ClipboardEvent("paste", {
      clipboardData: dataTransfer,
      bubbles: this.event.bubbles,
      cancelable: this.event.cancelable,
      composed: this.event.composed
    });
  }

  protected override shouldRenameAttachments(file: File): boolean {
    if (this.plugin.settings.renameOnlyImages && !isImageFile(file)) {
      return false;
    }
    return file.path === "" || this.plugin.settings.renamePastedFilesWithKnownNames;
  }

  protected override shouldConvertImages(): boolean {
    return this.plugin.settings.convertImagesToJpeg;
  }
}

class DropEventWrapper extends EventWrapper {
  public constructor(
    protected override readonly event: DragEvent,
    plugin: CustomAttachmentLocationPlugin
  ) {
    super(event, "Drop", plugin);
  }

  protected override getDataTransfer(): DataTransfer | null {
    return this.event.dataTransfer;
  }

  protected override cloneWithNewDataTransfer(dataTransfer: DataTransfer): DragEvent {
    return new DragEvent("drop", {
      dataTransfer,
      bubbles: this.event.bubbles,
      cancelable: this.event.cancelable,
      composed: this.event.composed,
      clientX: this.event.clientX,
      clientY: this.event.clientY
    });
  }

  protected override shouldRenameAttachments(file: File): boolean {
    if (this.plugin.settings.renameOnlyImages && !isImageFile(file)) {
      return false;
    }

    return this.plugin.settings.renameAttachmentsOnDragAndDrop;
  }

  protected override shouldConvertImages(): boolean {
    return this.plugin.settings.convertImagesToJpeg && this.plugin.settings.convertImagesOnDragAndDrop;
  }
}
