import type {
  SelectorFn,
  SelectorOptions,
  TFunction
} from 'i18next';
import type {
  LiteralToPrimitiveDeep,
  PartialDeep,
  ReadonlyDeep
} from 'type-fest';

import {
  init,
  t as tLib
} from 'i18next';
import { getLanguage } from 'obsidian';

import type { defaultTranslations } from './locales/default.ts';

import {
  DEFAULT_LANGUAGE,
  translationsMap
} from './locales/translationsMap.ts';

export const DEFAULT_NS = 'translation';
export type DefaultTranslations = typeof defaultTranslations;
export type FullTranslations = LiteralToPrimitiveDeep<DefaultTranslations>;
export type Translations = PartialDeep<FullTranslations>;
export type TranslationsMap = Record<string, Translations>;

let isInitialized = false;

export async function initI18N(): Promise<void> {
  if (isInitialized) {
    return;
  }

  await init({
    fallbackLng: DEFAULT_LANGUAGE,
    lng: getLanguage(),
    resources: Object.fromEntries(
      Object.entries(translationsMap).map(([language, translations]) => [
        language,
        {
          [DEFAULT_NS]: translations
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
  selector: SelectorFn<ReadonlyDeep<Translations>, string, SelectorOptions<[typeof DEFAULT_NS]>>,
  options?: SelectorOptions<[typeof DEFAULT_NS]>
): string {
  if (!isInitialized) {
    throw new Error('I18N is not initialized');
  }

  return tLib(selector, options);
}

export const t = tImpl as TFunction;
