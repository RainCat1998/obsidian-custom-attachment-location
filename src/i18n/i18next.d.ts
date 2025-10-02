import type { CustomTypeOptionsBase } from 'obsidian-dev-utils/obsidian/i18n/CustomTypeOptionsBase';

import type { PluginTypes } from '../PluginTypes.ts';

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Need to extend CustomTypeOptionsBase.
  interface CustomTypeOptions extends CustomTypeOptionsBase<PluginTypes> {
  }
}
