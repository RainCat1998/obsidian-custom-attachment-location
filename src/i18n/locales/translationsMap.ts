import type { TranslationsMap } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

import { en } from './en.ts';
import { zh } from './zh.ts';

export const DEFAULT_LANGUAGE: keyof typeof translationsMapImpl = 'en';

const translationsMapImpl = {
  en,
  zh
} as const;

export const translationsMap: TranslationsMap<PluginTypes> = translationsMapImpl;
