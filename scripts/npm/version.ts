import {
  execFromRoot,
  resolvePathFromRoot
} from "../tools/root.ts";

import {
  readFile,
  writeFile
} from "node:fs/promises";
import { existsSync } from "node:fs";

import process from "node:process";
import { createInterface } from "node:readline/promises";

type ObsidianReleasesJson = {
  name: string;
};

type Manifest = {
  minAppVersion: string;
  version: string;
};

type Versions = Record<string, string>;

export default async function version(): Promise<void> {
  const targetVersion = process.env["npm_package_version"];

  if (!targetVersion) {
    throw new Error("package.json version is not set");
  }

  const indentSize = 2;

  const manifestJsonPath = resolvePathFromRoot("manifest.json");
  const versionsJsonPath = resolvePathFromRoot("versions.json");

  const manifest = JSON.parse(await readFile(manifestJsonPath, "utf8")) as Manifest;
  manifest.minAppVersion = await getLatestObsidianVersion();
  manifest.version = targetVersion;
  await writeFile(manifestJsonPath, JSON.stringify(manifest, null, indentSize) + "\n");

  const versions = JSON.parse(await readFile(versionsJsonPath, "utf8")) as Versions;
  versions[targetVersion] = manifest.minAppVersion;
  await writeFile(versionsJsonPath, JSON.stringify(versions, null, indentSize) + "\n");

  const changelogPath = resolvePathFromRoot("CHANGELOG.md");
  let previousChangelogLines: string[];
  if (!existsSync(changelogPath)) {
    previousChangelogLines = [];
  } else {
    const content = await readFile(changelogPath, "utf8");
    previousChangelogLines = content.split("\n").slice(2);
    if (previousChangelogLines.at(-1) === "") {
      previousChangelogLines.pop();
    }
  }

  const lastTag = previousChangelogLines[0]?.replace("## ", "");
  const commitRange = lastTag ? `${lastTag}..HEAD` : "HEAD";
  const commitMessages = (await execFromRoot(`git log ${commitRange} --format=%s --first-parent`, { quiet: true })).split(/\r?\n/);

  let newChangeLog = `# CHANGELOG\n\n## ${targetVersion}\n\n`;

  for (const message of commitMessages) {
    newChangeLog += `- ${message}\n`;
  }

  if (previousChangelogLines.length > 0) {
    newChangeLog += "\n";
    for (const line of previousChangelogLines) {
      newChangeLog += `${line}\n`;
    }
  }

  await writeFile(changelogPath, newChangeLog, "utf8");

  await createInterface(process.stdin, process.stdout).question("Please update the CHANGELOG.md file. Press Enter when you are done...");

  await execFromRoot("git add manifest.json package.json versions.json CHANGELOG.md");
}

async function getLatestObsidianVersion(): Promise<string> {
  const response = await fetch("https://api.github.com/repos/obsidianmd/obsidian-releases/releases/latest");
  const obsidianReleasesJson = await response.json() as ObsidianReleasesJson;
  return obsidianReleasesJson.name;
}
