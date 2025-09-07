import type { LocaleMap } from '../i18n.ts';

import { enLocale } from './en.ts';

export const DEFAULT_LANGUAGE: keyof typeof localeMapImpl = 'en';

const localeMapImpl = {
  en: enLocale
} as const;

export const localeMap: LocaleMap = localeMapImpl;
