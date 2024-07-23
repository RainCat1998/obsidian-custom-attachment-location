import { existsSync } from "node:fs";
import { tsImportFromRoot } from "./root.ts";

interface ScriptModule {
  default: () => Promise<void>;
  isLongRunning?: boolean;
}

export default async function runNpmScript(scriptName: string): Promise<boolean> {
  if (!scriptName) {
    throw new Error("Script name is not provided");
  }

  const scriptPath = `./scripts/npm/${scriptName}.ts`;

  if (!existsSync(scriptPath)) {
    throw new Error(`Script file "${scriptPath}" does not exist`);
  }

  let scriptModule;

  try {
    scriptModule = await tsImportFromRoot<ScriptModule>(scriptPath);
  } catch (e) {
    throw new Error(`Could not load script ${scriptName}`, { cause: e });
  }

  const scriptFn = scriptModule.default;

  if (typeof scriptFn !== "function") {
    throw new Error(`Script ${scriptName} does not export function`);
  }

  try {
    console.log(`Executing script ${scriptName}`);
    await scriptFn();
    return scriptModule.isLongRunning ?? false;
  } catch (e) {
    throw new Error(`Script ${scriptName} failed`, { cause: e });
  }
}
