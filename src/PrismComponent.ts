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
          /* eslint-disable perfectionist/sort-objects -- Need to keep object order. */
          prefix: {
            alias: 'regex',
            pattern: /\${/
          },
          token: {
            alias: 'number',
            pattern: /^[a-zA-Z0-9_,]+/
          },
          formatDelimiter: {
            alias: 'regex',
            pattern: /:/
          },
          format: {
            alias: 'string',
            pattern: /[a-zA-Z0-9_,-]+/
          },
          suffix: {
            alias: 'regex',
            pattern: /}/
          }
          /* eslint-enable perfectionist/sort-objects -- Need to keep object order. */
        },
        pattern: /\${.+?}/
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
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Need to delete language.
      delete prism.languages[TOKENIZED_STRING_LANGUAGE];
    });
  }
}
