import { join } from "obsidian-dev-utils/Path";
import type CustomAttachmentLocationPlugin from "./CustomAttachmentLocationPlugin.ts";
import { createFolderSafe } from "obsidian-dev-utils/obsidian/Vault";

export async function createFolderSafeEx(plugin: CustomAttachmentLocationPlugin, path: string): Promise<boolean> {
  const result = await createFolderSafe(plugin.app, path);
  if (plugin.settingsCopy.keepEmptyAttachmentFolders) {
    const gitKeepPath = join(path, ".gitkeep");
    if (!await plugin.app.vault.adapter.exists(gitKeepPath)) {
      await plugin.app.vault.create(gitKeepPath, "");
    }
  }

  return result;
}
