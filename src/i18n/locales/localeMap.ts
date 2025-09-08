import type { LocaleMap } from '../i18n.ts';

import { enUS } from './en-US.ts';
import { zhCN } from './zh-CN.ts';

export const DEFAULT_LANGUAGE: keyof typeof localeMapImpl = 'en-US';

const localeMapImpl = {
  'en-US': enUS,
  'zh-CN': zhCN
} as const;

export const localeMap: LocaleMap = localeMapImpl;
