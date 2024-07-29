import {
  TFile,
  type App,
  type TAbstractFile} from "obsidian";

export async function createFolderSafe(app: App, path: string): Promise<void> {
  if (await app.vault.adapter.exists(path)) {
    return;
  }

  try {
    await app.vault.adapter.mkdir(path);
  } catch (e) {
    if (!await app.vault.adapter.exists(path)) {
      throw e;
    }
  }
}

export function isNote(file: TAbstractFile | null): file is TFile {
  if (!(file instanceof TFile)) {
    return false;
  }

  const extension = file.extension.toLowerCase();
  return extension === "md" || extension === "canvas";
}
