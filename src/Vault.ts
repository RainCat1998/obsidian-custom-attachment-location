import type {
  App,
  TFile
} from "obsidian";

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

export function isNote(file: TFile | null): file is TFile {
  if (!file) {
    return false;
  }

  const extension = file.extension.toLowerCase();
  return extension === "md" || extension === "canvas";
}
