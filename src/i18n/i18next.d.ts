import type {
  DEFAULT_NS,
  DefaultLocale
} from './i18n.ts';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NS;
    enableSelector: true;
    resources: {
      [DEFAULT_NS]: DefaultLocale;
    };
  }
}
