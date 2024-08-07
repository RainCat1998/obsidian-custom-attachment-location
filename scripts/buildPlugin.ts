import esbuild from "esbuild";
import process from "node:process";
import builtins from "builtin-modules";
import { existsSync } from "node:fs";
import {
  cp,
  mkdir,
  readFile,
  rm,
  writeFile
} from "node:fs/promises";
import { execFromRoot } from "./tools/root.ts";

interface NpmPackage {
  name: string;
}

export enum BuildMode {
  Development,
  Production
}

type SourceMap = {
  sources: string[];
};

export default async function buildPlugin({
  mode,
  obsidianConfigDir = process.env["OBSIDIAN_CONFIG_DIR"]
}:
{
  mode: BuildMode
  obsidianConfigDir?: string
}): Promise<void> {
  const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

  const isProductionBuild = mode === BuildMode.Production;

  const distDir = isProductionBuild ? "dist/build" : "dist/dev";
  if (existsSync(distDir)) {
    await rm(distDir, { recursive: true });
  }
  await mkdir(distDir, { recursive: true });

  const distFileNames = [
    "manifest.json",
    "styles.css"
  ];
  if (!isProductionBuild) {
    await writeFile(`${distDir}/.hotreload`, "", "utf8");
  }

  for (const fileName of distFileNames) {
    const localFile = `./${fileName}`;
    const distFile = `${distDir}/${fileName}`;

    if (existsSync(localFile)) {
      await cp(localFile, distFile);
    }
  }

  const distPath = `${distDir}/main.js`;

  const npmPackage = JSON.parse(await readFile("./package.json", "utf8")) as NpmPackage;
  const pluginName = npmPackage.name;

  const context = await esbuild.context({
    banner: {
      js: banner,
    },
    entryPoints: ["src/main.ts"],
    bundle: true,
    external: [
      "obsidian",
      "electron",
      "@codemirror/autocomplete",
      "@codemirror/collab",
      "@codemirror/commands",
      "@codemirror/language",
      "@codemirror/lint",
      "@codemirror/search",
      "@codemirror/state",
      "@codemirror/view",
      "@lezer/common",
      "@lezer/highlight",
      "@lezer/lr",
      ...builtins],
    format: "cjs",
    target: "esnext",
    logLevel: "info",
    sourcemap: isProductionBuild ? false : "inline",
    treeShaking: true,
    outfile: distPath,
    platform: "node",
    plugins: [
      {
        name: "preprocess",
        setup(build): void {
          build.onLoad({ filter: /\.(js|ts|cjs|mjs|cts|mts)$/ }, async (args) => {
            let contents = await readFile(args.path, "utf8");
            contents = contents.replace(/import\.meta\.url/g, "__filename");
            // HACK: The ${""} part is used to ensure Obsidian loads the plugin properly otherwise it stops loading it after the first line of the sourceMappingURL comment.
            contents = contents.replace(/\`\r?\n\/\/# sourceMappingURL/g, "`\n//#${\"\"} sourceMappingURL");

            if (/\bprocess\./.test(contents)) {
              contents = `globalThis.process ??= {
  platform: "mobile",
  cwd: () => "/",
  env: {}
};
` + contents;
            }

            return {
              contents,
              loader: "ts"
            };
          });
        },
      },
      {
        name: "lint",
        setup(build): void {
          build.onEnd(async () => {
            if (isProductionBuild) {
              return;
            }
            console.log("[watch] lint started");
            await execFromRoot("npx eslint . --fix", { ignoreExitCode: true });
            console.log("[watch] lint finished");
          });
        },
      },
      {
        name: "fix-source-maps",
        setup(build): void {
          build.onEnd(async () => {
            if (isProductionBuild) {
              return;
            }

            const content = await readFile(distPath, "utf8");
            const newContent = content.replaceAll(/\n\/\/# sourceMappingURL=data:application\/json;base64,(.+)/g, (_: string, sourceMapBase64: string): string => {
              return `\n//# sourceMappingURL=data:application/json;base64,${fixSourceMap(sourceMapBase64, pluginName)}`;
            });

            if (content !== newContent) {
              await writeFile(distPath, newContent);
            }
          });
        }
      },
      {
        name: "copy-to-obsidian-plugins-folder",
        setup(build): void {
          build.onEnd(async () => {
            if (isProductionBuild || !obsidianConfigDir) {
              return;
            }

            const pluginDir = `${obsidianConfigDir}/plugins/${pluginName}`;
            if (!existsSync(pluginDir)) {
              await mkdir(pluginDir);
            }

            await cp(distDir, pluginDir, { recursive: true });
          });
        }
      }
    ]
  });

  if (isProductionBuild) {
    await context.rebuild();
  } else {
    await context.watch();
  }
}

function fixSourceMap(sourceMapBase64: string, pluginName: string): string {
  const sourceMapJson = Buffer.from(sourceMapBase64, "base64").toString("utf8");
  const sourceMap = JSON.parse(sourceMapJson) as SourceMap;
  sourceMap.sources = sourceMap.sources.map(path => convertPathToObsidianUrl(path, pluginName));
  return Buffer.from(JSON.stringify(sourceMap)).toString("base64");
}

function convertPathToObsidianUrl(path: string, pluginName: string): string {
  const convertedPath = path.replaceAll("\\", "/").replace(/^(\.\.\/)+/, "");
  return `app://obsidian.md/plugin:${pluginName}/${convertedPath}`;
}
