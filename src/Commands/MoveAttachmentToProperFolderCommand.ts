import type {
  TAbstractFile,
  TFile
} from 'obsidian';

import {
  Notice,
  Vault
} from 'obsidian';
import { abortSignalAny } from 'obsidian-dev-utils/AbortController';
import { toJson } from 'obsidian-dev-utils/ObjectUtils';
import {
  AbstractFileCommandBase,
  AbstractFileCommandInvocationBase,
  AbstractFilesCommandInvocationBase,
  ArrayDelegatingAbstractFileCommandInvocation
} from 'obsidian-dev-utils/obsidian/Commands/AbstractFileCommandBase';
import {
  isFile,
  isFolder
} from 'obsidian-dev-utils/obsidian/FileSystem';
import { t } from 'obsidian-dev-utils/obsidian/i18n/i18n';
import {
  editLinks,
  updateLink
} from 'obsidian-dev-utils/obsidian/Link';
import { loop } from 'obsidian-dev-utils/obsidian/Loop';
import { getBacklinksForFileSafe } from 'obsidian-dev-utils/obsidian/MetadataCache';
import { copySafe } from 'obsidian-dev-utils/obsidian/Vault';
import { deleteSafe } from 'obsidian-dev-utils/obsidian/VaultEx';

import type { Plugin } from '../Plugin.ts';

import {
  getProperAttachmentPath,
  isNoteEx
} from '../AttachmentCollector.ts';
import { selectMode } from '../Modals/MoveAttachmentToProperFolderUsedByMultipleNotesModal.ts';
import { MoveAttachmentToProperFolderUsedByMultipleNotesMode } from '../PluginSettings.ts';
import { ActionContext } from '../TokenEvaluatorContext.ts';

interface MoveAttachmentToProperFolderContext {
  mode?: MoveAttachmentToProperFolderUsedByMultipleNotesMode;
}

class MoveAttachmentToProperFolderCommandInvocation extends AbstractFilesCommandInvocationBase<Plugin> {
  public constructor(plugin: Plugin, abstractFiles: TAbstractFile[]) {
    super(plugin, abstractFiles);
  }

  protected override canExecute(): boolean {
    if (!super.canExecute()) {
      return false;
    }

    for (const abstractFile of this.abstractFiles) {
      if (isFile(abstractFile) && isNoteEx(this.plugin, abstractFile)) {
        return false;
      }
    }

    return true;
  }

  protected override async execute(): Promise<void> {
    const attachmentFilesSet = new Set<TFile>();

    for (const abstractFile of this.abstractFiles) {
      if (isFile(abstractFile) && !isNoteEx(this.plugin, abstractFile)) {
        attachmentFilesSet.add(abstractFile);
      }

      if (isFolder(abstractFile)) {
        Vault.recurseChildren(abstractFile, (child) => {
          if (isFile(child) && !isNoteEx(this.plugin, child)) {
            attachmentFilesSet.add(child);
          }
        });
      }
    }

    const attachmentFiles = Array.from(attachmentFilesSet);
    attachmentFiles.sort((a, b) => a.path.localeCompare(b.path));

    const abortController = new AbortController();
    const combinedAbortSignal = abortSignalAny(abortController.signal, this.plugin.abortSignal);
    const ctx: MoveAttachmentToProperFolderContext = {};

    await loop({
      abortSignal: combinedAbortSignal,
      buildNoticeMessage: (attachmentFile, iterationStr) =>
        t(($) => $.moveAttachmentToProperFolder.progressBar.message, { attachmentFilePath: attachmentFile.path, iterationStr }),
      items: attachmentFiles,
      processItem: async (attachmentFile) => {
        combinedAbortSignal.throwIfAborted();
        if (this.plugin.settings.isPathIgnored(attachmentFile.path)) {
          console.warn(`Cannot move attachment to proper folder as attachment path is ignored: ${attachmentFile.path}.`);
          return;
        }
        if (!await this.moveAttachmentToProperFolder(attachmentFile, ctx)) {
          return;
        }
        combinedAbortSignal.throwIfAborted();
      },
      progressBarTitle: `${this.plugin.manifest.name}: ${t(($) => $.moveAttachmentToProperFolder.progressBar.title)}`,
      shouldContinueOnError: true,
      shouldShowProgressBar: true
    });
  }

  private async moveAttachmentToProperFolder(attachmentFile: TFile, ctx: MoveAttachmentToProperFolderContext): Promise<boolean> {
    let backlinks = await getBacklinksForFileSafe(this.plugin.app, attachmentFile);
    if (backlinks.keys().length === 0) {
      new Notice(t(($) => $.moveAttachmentToProperFolder.unusedAttachment, { attachmentPath: attachmentFile.path }));
      return true;
    }

    let backlinksToCopy: string[] = [];
    const that = this;

    if (backlinks.keys().length > 1 && !await handleMode(ctx.mode ?? this.plugin.settings.moveAttachmentToProperFolderUsedByMultipleNotesMode)) {
      return false;
    }

    for (const backlink of backlinksToCopy) {
      const backlinkFile = this.plugin.app.vault.getFileByPath(backlink);
      if (!backlinkFile) {
        continue;
      }

      const link = backlinks.get(backlink)?.[0];
      if (!link) {
        continue;
      }

      const newAttachmentPath = await getProperAttachmentPath({
        actionContext: ActionContext.MoveAttachmentToProperFolder,
        attachmentFile,
        noteFilePath: backlink,
        plugin: this.plugin,
        reference: link
      });
      if (!newAttachmentPath) {
        console.warn(`Skipping moving attachment ${attachmentFile.path} to proper folder as it is already in the destination folder.`);
        continue;
      }

      const linkJsons = new Set((backlinks.get(backlink) ?? []).map((reference) => toJson(reference)));

      await copySafe(this.plugin.app, attachmentFile, newAttachmentPath);
      await editLinks(this.plugin.app, backlinkFile, (link2) => {
        const linkJson = toJson(link2);
        if (!linkJsons.has(linkJson)) {
          return;
        }

        return updateLink({
          app: this.plugin.app,
          link: link2,
          newSourcePathOrFile: backlinkFile,
          newTargetPathOrFile: newAttachmentPath,
          oldTargetPathOrFile: attachmentFile
        });
      });
    }

    // eslint-disable-next-line require-atomic-updates -- Don't have a better way to do this.
    backlinks = await getBacklinksForFileSafe(this.plugin.app, attachmentFile);

    if (backlinks.keys().length === 0) {
      await deleteSafe(this.plugin.app, attachmentFile);
    }

    return true;

    async function handleMode(mode: MoveAttachmentToProperFolderUsedByMultipleNotesMode): Promise<boolean> {
      switch (mode) {
        case MoveAttachmentToProperFolderUsedByMultipleNotesMode.Cancel:
          if (that.plugin.settings.moveAttachmentToProperFolderUsedByMultipleNotesMode === MoveAttachmentToProperFolderUsedByMultipleNotesMode.Cancel) {
            await selectMode(that.plugin.app, attachmentFile.path, Array.from(backlinks.keys()), true);
          }
          return false;
        case MoveAttachmentToProperFolderUsedByMultipleNotesMode.CopyAll:
          backlinksToCopy = Array.from(backlinks.keys());
          return true;
        case MoveAttachmentToProperFolderUsedByMultipleNotesMode.Prompt: {
          const { backlinksToCopy: backlinksToCopy2, mode: mode2, shouldUseSameActionForOtherProblematicAttachments } = await selectMode(
            that.plugin.app,
            attachmentFile.path,
            Array.from(backlinks.keys())
          );
          if (shouldUseSameActionForOtherProblematicAttachments) {
            ctx.mode = mode2;
          }

          if (mode2 === MoveAttachmentToProperFolderUsedByMultipleNotesMode.Prompt) {
            backlinksToCopy = backlinksToCopy2;
            return true;
          }

          return handleMode(mode2);
        }
        case MoveAttachmentToProperFolderUsedByMultipleNotesMode.Skip:
          backlinksToCopy = [];
          return true;
        default:
          return false;
      }
    }
  }
}

export class MoveAttachmentToProperFolderCommand extends AbstractFileCommandBase<Plugin> {
  public constructor(plugin: Plugin) {
    super({
      icon: 'move',
      id: 'move-attachment-to-proper-folder',
      name: t(($) => $.commands.moveAttachmentToProperFolder),
      plugin
    });
  }

  protected override createCommandInvocationForAbstractFile(file: null | TAbstractFile): AbstractFileCommandInvocationBase<Plugin> {
    return new ArrayDelegatingAbstractFileCommandInvocation(this.plugin, file, this.createCommandInvocationForAbstractFiles.bind(this));
  }

  protected override createCommandInvocationForAbstractFiles(abstractFiles: TAbstractFile[]): AbstractFilesCommandInvocationBase<Plugin> {
    return new MoveAttachmentToProperFolderCommandInvocation(this.plugin, abstractFiles);
  }

  protected override shouldAddToAbstractFileMenu(): boolean {
    return true;
  }

  protected override shouldAddToAbstractFilesMenu(): boolean {
    return true;
  }
}
