import {
  basename,
  extname
} from "obsidian-dev-utils/Path";

import {
  blobToArrayBuffer,
  blobToJpegArrayBuffer,
  isImageFile
} from "obsidian-dev-utils/Blob";
import {
  getAttachmentFolderFullPathForPath,
  getPastedFileName,
  makeFileName
} from "./AttachmentPath.ts";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import {
  createFolderSafe,
  isNote
} from "./Vault.ts";
import { convertAsyncToSync } from "obsidian-dev-utils/Async";
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

enum TargetType {
  Note = "Note",
  Canvas = "Canvas",
  Unsupported = "Unsupported"
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
          fileArrayBuffer = await blobToJpegArrayBuffer(entry.file, this.plugin.settingsCopy.jpegQuality);
          extension = "jpg";
        } else {
          fileArrayBuffer = await blobToArrayBuffer(entry.file);
        }

        const shouldRename = this.shouldRenameAttachments(entry.file);

        const filename = shouldRename ? await getPastedFileName(this.plugin, createSubstitutionsFromPath(noteFile.path, originalCopiedFileName)) : originalCopiedFileName;

        const filePropertyBag: FilePropertyBag = { type: "application/octet-stream" };
        if (!shouldRename) {
          filePropertyBag.lastModified = entry.file.lastModified;
        }
        const renamedFile = new File([new Blob([fileArrayBuffer])], makeFileName(filename, extension), filePropertyBag);
        if (!shouldRename) {
          Object.defineProperty(renamedFile, "path", { value: entry.file.path });
        }
        newDataTransfer.items.add(renamedFile);
        hasFiles = true;
      }
    }

    if (hasFiles) {
      const attachmentsFolderPath = await getAttachmentFolderFullPathForPath(this.plugin, noteFile.path);
      await createFolderSafe(this.plugin.app, attachmentsFolderPath, this.plugin.settingsCopy.keepEmptyAttachmentFolders);
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

    if (this.event.target.closest(".canvas-wrapper")) {
      return TargetType.Canvas;
    }

    const canvasView = this.plugin.app.workspace.getActiveFileView();

    if (this.event.target.matches("body") && canvasView?.getViewType() === "canvas" && canvasView.containerEl.closest(".mod-active")) {
      return TargetType.Canvas;
    }

    return TargetType.Unsupported;
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
    if (this.plugin.settingsCopy.renameOnlyImages && !isImageFile(file)) {
      return false;
    }
    return file.path === "" || this.plugin.settingsCopy.renamePastedFilesWithKnownNames;
  }

  protected override shouldConvertImages(): boolean {
    return this.plugin.settingsCopy.convertImagesToJpeg;
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
    if (this.plugin.settingsCopy.renameOnlyImages && !isImageFile(file)) {
      return false;
    }

    return this.plugin.settingsCopy.renameAttachmentsOnDragAndDrop;
  }

  protected override shouldConvertImages(): boolean {
    return this.plugin.settingsCopy.convertImagesToJpeg && this.plugin.settingsCopy.convertImagesOnDragAndDrop;
  }
}
