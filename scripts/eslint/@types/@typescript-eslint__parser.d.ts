declare module "@typescript-eslint/parser" {
  import type {
    Linter
  } from "eslint";

  const parser: Linter.ParserModule;
  export default parser;
}
