import type { TranslationsMap } from '../i18n.ts';

import { en } from './en.ts';
import { zh } from './zh.ts';

export const DEFAULT_LANGUAGE: keyof typeof translationsMapImpl = 'en';

const translationsMapImpl = {
  en,
  zh
} as const;

export const translationsMap: TranslationsMap = translationsMapImpl;
