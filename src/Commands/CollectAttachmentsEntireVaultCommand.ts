import { CommandInvocationBase } from 'obsidian-dev-utils/obsidian/Commands/CommandBase';
import { NonEditorCommandBase } from 'obsidian-dev-utils/obsidian/Commands/NonEditorCommandBase';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { Plugin } from '../Plugin.ts';

import { collectAttachmentsEntireVault } from '../AttachmentCollector.ts';

class CollectAttachmentsEntireVaultCommandInvocation extends CommandInvocationBase<Plugin> {
  public constructor(plugin: Plugin) {
    super(plugin);
  }

  protected override async execute(): Promise<void> {
    collectAttachmentsEntireVault(this.plugin);
    await Promise.resolve();
  }
}

export class CollectAttachmentsEntireVaultCommand extends NonEditorCommandBase<Plugin> {
  public constructor(plugin: Plugin) {
    super({
      icon: 'download',
      id: 'collect-attachments-entire-vault',
      name: t(($) => $.commands.collectAttachmentsEntireVault),
      plugin
    });
  }

  protected override createCommandInvocation(): CommandInvocationBase {
    return new CollectAttachmentsEntireVaultCommandInvocation(this.plugin);
  }
}
