import type { TFolder } from 'obsidian';

import {
  FolderCommandBase,
  FolderCommandInvocationBase
} from 'obsidian-dev-utils/obsidian/Commands/FolderCommandBase';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { Plugin } from '../Plugin.ts';

import { collectAttachmentsInAbstractFiles } from '../AttachmentCollector.ts';

class CollectAttachmentsInFolderCommandInvocation extends FolderCommandInvocationBase<Plugin> {
  public constructor(plugin: Plugin, folder: null | TFolder) {
    super(plugin, folder);
  }

  protected override async execute(): Promise<void> {
    collectAttachmentsInAbstractFiles(this.plugin, [this.folder]);
    await Promise.resolve();
  }
}

export class CollectAttachmentsInCurrentFolderCommand extends FolderCommandBase<Plugin> {
  public constructor(plugin: Plugin) {
    super({
      icon: 'download',
      id: 'collect-attachments-in-current-folder',
      name: t(($) => $.commands.collectAttachmentsCurrentFolder),
      plugin
    });
  }

  protected override createCommandInvocationForFolder(folder: null | TFolder): FolderCommandInvocationBase<Plugin> {
    return new CollectAttachmentsInFolderCommandInvocation(this.plugin, folder);
  }
}
