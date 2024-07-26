import type { App } from "obsidian";

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
