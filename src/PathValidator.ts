const INVALID_FILENAME_PATH_CHARS_REG_EXP = /[\\/:*?"<>|]/;
const ONLY_DOTS_REG_EXP = /^\.+$/;

export function validateFilename(filename: string): string {
  filename = removeDateFormatting(filename);

  if (!filename) {
    return 'File name is empty';
  }

  if (INVALID_FILENAME_PATH_CHARS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains invalid symbols`;
  }

  if (ONLY_DOTS_REG_EXP.test(filename)) {
    return `File name "${filename}" contains only dots`;
  }

  return '';
}

export function validatePath(path: string): string {
  path = removeDateFormatting(path);

  if (path.startsWith('/')) {
    return 'Path can\'t start with /';
  }
  if (path.endsWith('/')) {
    return 'Path can\'t end with /';
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

function removeDateFormatting(str: string): string {
  return str.replaceAll(/\$\{date:.+?\}/g, '${date}');
}
