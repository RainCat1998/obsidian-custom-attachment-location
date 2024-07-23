declare module "@typescript-eslint/eslint-plugin" {
  import type {
    ESLint,
    Linter
  } from "eslint";

  type Config = {
    overrides: Config[];
    rules: Linter.RulesRecord;
  }

  const plugin: ESLint.Plugin & {
    configs: Record<string, Config>
  };
  export default plugin;
}
