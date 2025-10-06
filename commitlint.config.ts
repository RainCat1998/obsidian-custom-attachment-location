import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional']
};

// eslint-disable-next-line import-x/no-default-export -- Commitlint infrastructure requires a default export.
export default config;
