import { readdir } from "node:fs/promises";
import process from "node:process";
import runNpmScript from "../tools/npmScriptRunner.ts";
import {
  execFromRoot,
  resolvePathFromRoot
} from "../tools/root.ts";

export default async function postversion(): Promise<void> {
  await execFromRoot("git push");
  await execFromRoot("git push --tags");

  await runNpmScript("build");

  const newVersion = process.env["npm_package_version"];

  const buildDir = resolvePathFromRoot("dist/build");
  const fileNames = await readdir(buildDir);
  const filePaths = fileNames.map(fileName => `${buildDir}/${fileName}`);
  const filePathsStr = filePaths.map(filePath => `"${filePath}"`).join(" ");

  await execFromRoot(`gh release create "${newVersion}" ${filePathsStr} --title "v${newVersion}" --notes-file CHANGELOG.md`);
}
