import type { TranslationsMap } from '../i18n.ts';

import { enUS } from './en-US.ts';
import { zhCN } from './zh-CN.ts';

export const DEFAULT_LANGUAGE: keyof typeof translationsMapImpl = 'en-US';

const translationsMapImpl = {
  'en-US': enUS,
  'zh-CN': zhCN
} as const;

export const translationsMap: TranslationsMap = translationsMapImpl;
