import { trimEnd, trimStart } from "obsidian-dev-utils/String";
import { SUBSTITUTION_VARIABLE_REG_EXP } from "./Substitutions.ts";

export const INVALID_FILENAME_PATH_CHARS_REG_EXP = /[\\/:*?"<>|]/;
const MORE_THAN_TWO_DOTS_REG_EXP = /^\.{3,}$/;

export function validateFilename(filename: string): string {
  filename = removeVariableFormatting(filename);

  if (!filename) {
    return 'File name is empty';
  }

  if (INVALID_FILENAME_PATH_CHARS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains invalid symbols`;
  }

  if (MORE_THAN_TWO_DOTS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains more than two dots`;
  }

  return '';
}

export function validatePath(path: string): string {
  path = removeVariableFormatting(path);

  path = trimStart(path, '/');
  path = trimEnd(path, '/');

  if (path === '') {
    return '';
  }

  const parts = path.split('/');
  for (const part of parts) {
    if (part === '.') {
      continue;
    }

    const partValidationError = validateFilename(part);

    if (partValidationError) {
      return partValidationError;
    }
  }

  return '';
}

function removeVariableFormatting(str: string): string {
  return str.replace(SUBSTITUTION_VARIABLE_REG_EXP, (_, key) => `\${${key}}`);
}
