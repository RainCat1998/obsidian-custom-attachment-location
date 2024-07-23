import { tsImport } from "tsx/esm/api";
const module = await tsImport("./scripts/eslint/eslint.config.ts", import.meta.url);
const configs = module.default;
export default configs;
