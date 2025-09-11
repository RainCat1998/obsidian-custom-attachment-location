import type {
  App,
  FileStats
} from 'obsidian';

/**
 * An action context.
 */
export enum ActionContext {
  /**
   * Collect attachments.
   */
  CollectAttachments = 'CollectAttachments',

  /**
   * Delete note.
   */
  DeleteNote = 'DeleteNote',

  /**
   * Import files.
   */
  ImportFiles = 'ImportFiles',

  /**
   * Open file.
   */
  OpenFile = 'OpenFile',

  /**
   * Rename note.
   */
  RenameNote = 'RenameNote',

  /**
   * Save attachment.
   */
  SaveAttachment = 'SaveAttachment',

  /**
   * Unknown.
   */
  Unknown = 'Unknown',

  /**
   * Validate tokens.
   */
  ValidateTokens = 'ValidateTokens'
}

/**
 * Context passed to token evaluators.
 */
export interface TokenEvaluatorContext {
  /**
   * An abort signal to control the execution of the function.
   */
  abortSignal: AbortSignal;

  /**
   * An action context.
   */
  actionContext: ActionContext;

  /**
   * An Obsidian app instance.
   */
  app: App;

  /**
   * A content of the attachment file.
   *
   * `undefined` if the attachment file content is not known.
   */
  attachmentFileContent: ArrayBuffer | undefined;

  /**
   * Stats of the attachment file.
   *
   * `undefined` if the attachment file stats is not known.
   *
   * @remark It may be initialized only partially. Uninitialized {@link FileStats.ctime} and {@link FileStats.mtime} will be `0`.
   */
  attachmentFileStat: FileStats | undefined;

  /**
   * Fills a template with the current context.
   */
  fillTemplate(template: string): Promise<string>;

  /**
   * The format of the token.
   */
  format: string;

  /**
   * A full template string.
   */
  fullTemplate: string;

  /**
   * A generated attachment file name.
   *
   * Empty string if the attachment file name is not fully generated yet.
   */
  generatedAttachmentFileName: string;

  /**
   * A generated attachment file path.
   *
   * Empty string if the attachment file path is not fully generated yet.
   */
  generatedAttachmentFilePath: string;

  /**
   * A name of the note file.
   */
  noteFileName: string;

  /**
   * A path of the note file.
   */
  noteFilePath: string;

  /**
   * A name of the note folder.
   */
  noteFolderName: string;

  /**
   * A path of the note folder.
   */
  noteFolderPath: string;

  /**
   * An Obsidian API.
   *
   * {@link https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts}
   */
  obsidian: typeof import('obsidian');

  /**
   * A name of the old note file.
   */
  oldNoteFileName: string;

  /**
   * A path of the old note file.
   */
  oldNoteFilePath: string;

  /**
   * A name of the old note folder.
   */
  oldNoteFolderName: string;

  /**
   * A path of the old note folder.
   */
  oldNoteFolderPath: string;

  /**
   * An extension of the original attachment file.
   */
  originalAttachmentFileExtension: string;

  /**
   * A name of the original attachment file.
   */
  originalAttachmentFileName: string;

  /**
   * A token being evaluated.
   */
  token: string;

  /**
   * An end offset of the token within the full template.
   */
  tokenEndOffset: number;

  /**
   * A start offset of the token within the full template.
   */
  tokenStartOffset: number;

  /**
   * A token with the format.
   */
  tokenWithFormat: string;
}
