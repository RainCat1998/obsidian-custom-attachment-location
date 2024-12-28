import {
  trimEnd,
  trimStart
} from 'obsidian-dev-utils/String';

import {
  SUBSTITUTION_TOKEN_REG_EXP,
  Substitutions
} from './Substitutions.ts';

export const INVALID_FILENAME_PATH_CHARS_REG_EXP = /[\\/:*?"<>|]/;
const MORE_THAN_TWO_DOTS_REG_EXP = /^\.{3,}$/;
const TRAILING_DOTS_AND_SPACES_REG_EXP = /[. ]+$/;

export function validateFilename(filename: string): string {
  filename = removeTokenFormatting(filename);
  const unknownToken = validateTokens(filename);
  if (unknownToken) {
    return `Unknown token: ${unknownToken}`;
  }

  if (!filename) {
    return 'File name is empty';
  }

  if (INVALID_FILENAME_PATH_CHARS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains invalid symbols`;
  }

  if (MORE_THAN_TWO_DOTS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains more than two dots`;
  }

  if (TRAILING_DOTS_AND_SPACES_REG_EXP.test(filename)) {
    return `File name "${filename}" contains trailing dots or spaces`;
  }

  return '';
}

export function validatePath(path: string): string {
  path = removeTokenFormatting(path);

  path = trimStart(path, '/');
  path = trimEnd(path, '/');

  if (path === '') {
    return '';
  }

  const parts = path.split('/');
  for (const part of parts) {
    const partValidationError = validateFilename(part);

    if (partValidationError) {
      return partValidationError;
    }
  }

  return '';
}

function removeTokenFormatting(str: string): string {
  return str.replace(SUBSTITUTION_TOKEN_REG_EXP, (_, token) => `\${${token}}`);
}

function validateTokens(str: string): null | string {
  const matches = str.matchAll(SUBSTITUTION_TOKEN_REG_EXP);
  for (const match of matches) {
    const token = match[1] ?? '';
    if (!Substitutions.isRegisteredToken(token)) {
      return token;
    }
  }
  return null;
}
