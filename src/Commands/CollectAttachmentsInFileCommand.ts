import type { TAbstractFile } from 'obsidian';

import {
  AbstractFileCommandBase,
  AbstractFileCommandInvocationBase,
  AbstractFilesCommandInvocationBase,
  ArrayDelegatingAbstractFileCommandInvocation
} from 'obsidian-dev-utils/obsidian/Commands/AbstractFileCommandBase';
import {
  isFile,
  isNote
} from 'obsidian-dev-utils/obsidian/FileSystem';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { Plugin } from '../Plugin.ts';

import { collectAttachmentsInAbstractFiles } from '../AttachmentCollector.ts';

class CollectAttachmentsInFilesCommandInvocation extends AbstractFilesCommandInvocationBase<Plugin> {
  public constructor(plugin: Plugin, abstractFiles: TAbstractFile[]) {
    super(plugin, abstractFiles);
  }

  protected override canExecute(): boolean {
    if (!super.canExecute()) {
      return false;
    }

    for (const abstractFile of this.abstractFiles) {
      if (isFile(abstractFile) && !isNote(this.app, abstractFile)) {
        return false;
      }
    }

    return true;
  }

  protected override async execute(): Promise<void> {
    collectAttachmentsInAbstractFiles(this.plugin, this.abstractFiles);
  }
}

export class CollectAttachmentsInFileCommand extends AbstractFileCommandBase<Plugin> {
  public override fileMenuItemName = t(($) => $.menuItems.collectAttachmentsInFile);
  public override filesMenuItemName = t(($) => $.menuItems.collectAttachmentsInFiles);

  public constructor(plugin: Plugin) {
    super({
      icon: 'download',
      id: 'collect-attachments-in-file',
      name: t(($) => $.commands.collectAttachmentsCurrentNote),
      plugin
    });
  }

  protected override createCommandInvocationForAbstractFile(file: null | TAbstractFile): AbstractFileCommandInvocationBase<Plugin> {
    return new ArrayDelegatingAbstractFileCommandInvocation(this.plugin, file, this.createCommandInvocationForAbstractFiles.bind(this));
  }

  protected override createCommandInvocationForAbstractFiles(abstractFiles: TAbstractFile[]): AbstractFilesCommandInvocationBase<Plugin> {
    return new CollectAttachmentsInFilesCommandInvocation(this.plugin, abstractFiles);
  }

  protected override shouldAddToAbstractFileMenu(): boolean {
    return true;
  }

  protected override shouldAddToAbstractFilesMenu(): boolean {
    return true;
  }
}
