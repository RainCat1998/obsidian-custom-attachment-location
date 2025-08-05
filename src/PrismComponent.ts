import {
  Component,
  loadPrism
} from 'obsidian';
import { invokeAsyncSafely } from 'obsidian-dev-utils/Async';

export const TOKENIZED_STRING_LANGUAGE = 'custom-attachment-location-tokenized-string';

export class PrismComponent extends Component {
  public override onload(): void {
    super.onload();
    invokeAsyncSafely(this.initPrism.bind(this));
  }

  private async initPrism(): Promise<void> {
    const prism = await loadPrism();
    prism.languages[TOKENIZED_STRING_LANGUAGE] = {
      expression: {
        greedy: true,
        inside: {
          format: {
            alias: 'number',
            pattern: /[a-zA-Z0-9_]+/
          },
          formatDelimiter: {
            alias: 'regex',
            pattern: /:/
          },
          prefix: {
            alias: 'regex',
            pattern: /[${}]/
          },
          token: {
            alias: 'string',
            pattern: /^[a-zA-Z0-9_,]+/
          }
        },
        pattern: /\${[a-zA-Z0-9_]+(?::[a-zA-Z0-9_,]*)?}/
      },
      important: {
        pattern: /^\./
      },
      operator: {
        alias: 'entity',
        pattern: /\//
      }
    };

    this.register(() => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete prism.languages[TOKENIZED_STRING_LANGUAGE];
    });
  }
}
