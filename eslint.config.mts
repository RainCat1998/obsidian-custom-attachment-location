import type { Linter } from 'eslint';

import { obsidianDevUtilsConfigs } from 'obsidian-dev-utils/ScriptUtils/ESLint/eslint.config';

const configs: Linter.Config[] = [
  ...obsidianDevUtilsConfigs
];

// eslint-disable-next-line import-x/no-default-export
export default configs;
