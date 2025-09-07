import type {
  SelectorFn,
  SelectorOptions,
  TFunction
} from 'i18next';
import type { ReadonlyDeep } from 'type-fest';

import {
  init,
  t as tLib
} from 'i18next';
import { getLanguage } from 'obsidian';

import type { defaultLocale } from './locales/default.ts';

import {
  DEFAULT_LANGUAGE,
  localeMap
} from './locales/localeMap.ts';

export const DEFAULT_NS = 'translation';
export type Locale = typeof defaultLocale;
export type LocaleMap = Record<string, Partial<Locale>>;

let isInitialized = false;

export async function initI18N(): Promise<void> {
  if (isInitialized) {
    return;
  }

  await init({
    fallbackLng: DEFAULT_LANGUAGE,
    lng: getLanguage(),
    resources: Object.fromEntries(
      Object.entries(localeMap).map(([language, locale]) => [
        language,
        {
          [DEFAULT_NS]: locale
        }
      ])
    ),
    returnEmptyString: false,
    returnNull: false
  });

  // eslint-disable-next-line require-atomic-updates
  isInitialized = true;
}

export function tImpl(
  selector: SelectorFn<ReadonlyDeep<Locale>, string, SelectorOptions<[typeof DEFAULT_NS]>>,
  options?: SelectorOptions<[typeof DEFAULT_NS]>
): string {
  if (!isInitialized) {
    throw new Error('I18N is not initialized');
  }

  return tLib(selector, options);
}

export const t = tImpl as TFunction;
