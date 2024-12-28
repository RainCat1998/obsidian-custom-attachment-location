import type { App } from 'obsidian';
import type { MaybePromise } from 'obsidian-dev-utils/Async';

import moment from 'moment';
import { prompt } from 'obsidian-dev-utils/obsidian/Modal/Prompt';
import {
  basename,
  dirname,
  extname
} from 'obsidian-dev-utils/Path';
import { replaceAllAsync } from 'obsidian-dev-utils/String';

import { validateFilename } from './PathValidator.ts';

type Formatter = (substitutions: Substitutions, app: App, format: string) => MaybePromise<string>;

export const SUBSTITUTION_VARIABLE_REG_EXP = /\${(.+?)(?::(.+?))?}/g;

export class Substitutions {
  private static readonly formatters = new Map<string, Formatter>();
  static {
    this.registerFormatter('date', (substitutions, _app, format) => substitutions.formatDate(format));
    this.registerFormatter('fileName', (substitutions) => substitutions.fileName);
    this.registerFormatter('folderName', (substitutions) => substitutions.folderName);
    this.registerFormatter('folderPath', (substitutions) => substitutions.folderPath);
    this.registerFormatter('originalCopiedFileName', (substitutions) => substitutions.originalCopiedFileName);
    this.registerFormatter('prompt', (substitutions, app) => substitutions.prompt(app));
  }

  public readonly folderPath: string;
  private readonly fileName: string;
  private readonly folderName: string;
  private readonly originalCopiedFileName: string;

  public constructor(filePath: string, originalCopiedFileName?: string) {
    this.originalCopiedFileName = originalCopiedFileName ?? '';
    this.fileName = basename(filePath, extname(filePath));
    this.folderName = basename(dirname(filePath));
    this.folderPath = dirname(filePath);
  }

  private static registerFormatter(token: string, formatter: Formatter): void {
    this.formatters.set(token.toLowerCase(), formatter);
  }

  public async fillTemplate(app: App, template: string): Promise<string> {
    return await replaceAllAsync(template, SUBSTITUTION_VARIABLE_REG_EXP, async (_: string, token: string, format: string) => {
      const formatter = Substitutions.formatters.get(token.toLowerCase());
      if (!formatter) {
        throw new Error(`Invalid token: ${token}`);
      }

      return await formatter(this, app, format);
    });
  }

  private formatDate(format: string): string {
    return moment().format(format);
  }

  private async prompt(app: App): Promise<string> {
    const promptResult = await prompt({
      app,
      defaultValue: this.originalCopiedFileName,
      title: 'Provide a value for ${prompt} template',
      valueValidator: validateFilename
    });
    if (promptResult === null) {
      throw new Error('Prompt cancelled');
    }
    return promptResult;
  }
}
