import type { Linter } from 'eslint';

import { obsidianDevUtilsConfigs } from 'obsidian-dev-utils/ScriptUtils/ESLint/eslint.config';

const configs: Linter.Config[] = [
  ...obsidianDevUtilsConfigs,
  {
    rules: {
      'obsidianmd/ui/sentence-case': [
        'error',
        {
          brands: [
            'Backlink Cache',
            'Show Hidden Files'
          ]
        }
      ]
    }
  }
];

// eslint-disable-next-line import-x/no-default-export -- ESLint infrastructure requires a default export.
export default configs;
