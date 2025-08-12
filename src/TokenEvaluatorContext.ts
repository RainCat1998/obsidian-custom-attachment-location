import type { App } from 'obsidian';

/**
 * Context passed to token evaluators.
 */
export interface TokenEvaluatorContext {
  /**
   * The abort signal to control the execution of the function.
   */
  abortSignal: AbortSignal;

  /**
   * The Obsidian app instance.
   */
  app: App;

  /**
   * The content of the attachment file.
   *
   * `undefined` if the attachment file content is not known.
   */
  attachmentFileContent: ArrayBuffer | undefined;

  /**
   * Fills a template with the current context.
   */
  fillTemplate(template: string): Promise<string>;

  /**
   * The format of the token.
   */
  format: string;

  /**
   * The full template string.
   */
  fullTemplate: string;

  /**
   * The generated attachment file name.
   *
   * Empty string if the attachment file name is not fully generated yet.
   */
  generatedAttachmentFileName: string;

  /**
   * The generated attachment file path.
   *
   * Empty string if the attachment file path is not fully generated yet.
   */
  generatedAttachmentFilePath: string;

  /**
   * The name of the note file.
   */
  noteFileName: string;

  /**
   * The path of the note file.
   */
  noteFilePath: string;

  /**
   * The name of the note folder.
   */
  noteFolderName: string;

  /**
   * The path of the note folder.
   */
  noteFolderPath: string;

  /**
   * The extension of the original attachment file.
   */
  originalAttachmentFileExtension: string;

  /**
   * The name of the original attachment file.
   */
  originalAttachmentFileName: string;

  /**
   * The token being evaluated.
   */
  token: string;

  /**
   * The end offset of the token within the full template.
   */
  tokenEndOffset: number;

  /**
   * The start offset of the token within the full template.
   */
  tokenStartOffset: number;

  /**
   * The token with the format.
   */
  tokenWithFormat: string;
}
