import { execSync } from "node:child_process";
import {
  resolve,
} from "node:path";
import { tsImport } from "tsx/esm/api";
import { fileURLToPath } from "node:url";

export const rootUrl = new URL("../../", import.meta.url).href;
export const rootDir = fileURLToPath(rootUrl);

export function execFromRoot(command: string, ignoreExitCode?: boolean): void {
  try {
    execSync(command, {
      stdio: "inherit",
      cwd: rootDir
    });
  } catch (e) {
    if (!ignoreExitCode) {
      throw e;
    }
  }
}

export async function tsImportFromRoot<T>(specifier: string): Promise<T> {
  return await tsImport(specifier, rootUrl) as T;
}

export function resolvePathFromRoot(path: string): string {
  return resolve(rootDir, path);
}
