import {
  readdir,
  readFile
} from "node:fs/promises";
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

  const newVersion = process.env["npm_package_version"]!;

  const buildDir = resolvePathFromRoot("dist/build");
  const fileNames = await readdir(buildDir);
  const filePaths = fileNames.map(fileName => `${buildDir}/${fileName}`);
  const filePathsStr = filePaths.map(filePath => `"${filePath}"`).join(" ");

  const changelogPath = resolvePathFromRoot("CHANGELOG.md");
  const content = await readFile(changelogPath, "utf8");
  const newVersionEscaped = newVersion.replaceAll(".", "\\.");
  const match = content.match(new RegExp(`\n## ${newVersionEscaped}\n\n((.|\n)+?)\n\n##`));
  let releaseNotes = match ? match[1] + "\n\n" : "";

  const tags = (await execFromRoot("git tag --sort=-creatordate", { quiet: true })).split(/\r?\n/);
  const previousVersion = tags[1];
  let changesUrl = "";

  const repoUrl = await execFromRoot("gh repo view --json url -q .url");

  if (previousVersion) {
    changesUrl = `${repoUrl}/compare/${previousVersion}...${newVersion}`;
  } else {
    changesUrl = `${repoUrl}/commits/${newVersion}`;
  }

  releaseNotes += `**Full Changelog**: ${changesUrl}`;

  await execFromRoot(`gh release create "${newVersion}" ${filePathsStr} --title "v${newVersion}" --notes-file -`, {
    stdin: releaseNotes
  });
}
