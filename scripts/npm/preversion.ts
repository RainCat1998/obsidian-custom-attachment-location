import { execFromRoot } from "../tools/root.ts";
import runNpmScript from "../tools/npmScriptRunner.ts";

export default async function preversion(): Promise<void> {
  try {
    await execFromRoot("gh --version");
  } catch {
    throw new Error("GitHub CLI is not installed");
  }

  await runNpmScript("build");
  await runNpmScript("lint");
  await runNpmScript("spellcheck");
}
