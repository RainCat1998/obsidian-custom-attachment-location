import {
  normalizePath,
  type App,
  type ReferenceCache,
  type TFile
} from "obsidian";
import {
  getAllLinks,
  getCacheSafe
} from "./MetadataCache.ts";
import { applyFileChanges } from "./Vault.ts";
import { posix } from "@jinder/path";
import { generateMarkdownLink } from "./GenerateMarkdownLink.ts";
import { createTFileInstance } from "obsidian-typings/implementations";
const {
  basename,
  extname
} = posix;

type SplitSubpathResult = {
  linkPath: string;
  subpath: string | undefined;
};

export function splitSubpath(link: string): SplitSubpathResult {
  const SUBPATH_SEPARATOR = "#";
  const [linkPath = "", subpath] = link.split(SUBPATH_SEPARATOR);
  return {
    linkPath,
    subpath: subpath ? SUBPATH_SEPARATOR + subpath : undefined
  };
}

export async function updateLinksInFile(app: App, file: TFile, oldPath: string, renameMap: Map<string, string>, forceMarkdownLinks?: boolean): Promise<void> {
  await applyFileChanges(app, file, async () => {
    const cache = await getCacheSafe(app, file);
    if (!cache) {
      return [];
    }

    return getAllLinks(cache).map((link) => ({
      startIndex: link.position.start.offset,
      endIndex: link.position.end.offset,
      oldContent: link.original,
      newContent: convertLink(app, link, file, oldPath, renameMap, forceMarkdownLinks),
    }));
  });
}

function convertLink(app: App, link: ReferenceCache, source: TFile, oldPath: string, renameMap: Map<string, string>, forceMarkdownLinks?: boolean): string {
  oldPath ??= source.path;
  return updateLink({
    app,
    link,
    file: extractLinkFile(app, link, oldPath),
    oldPath,
    source,
    renameMap,
    forceMarkdownLinks
  });
}

export function extractLinkFile(app: App, link: ReferenceCache, oldPath: string): TFile | null {
  const { linkPath } = splitSubpath(link.link);
  return app.metadataCache.getFirstLinkpathDest(linkPath, oldPath);
}

export function updateLink({
  app,
  link,
  file,
  oldPath,
  source,
  renameMap,
  forceMarkdownLinks
}: {
  app: App,
  link: ReferenceCache,
  file: TFile | null,
  oldPath: string,
  source: TFile,
  renameMap: Map<string, string>,
  forceMarkdownLinks?: boolean | undefined
}): string {
  if (!file) {
    return link.original;
  }
  const isEmbed = link.original.startsWith("!");
  const isWikilink =
    link.original.includes("[[") && forceMarkdownLinks !== true;
  const { subpath } = splitSubpath(link.link);

  const newPath = renameMap.get(file.path);
  const alias = getAlias({
    app,
    displayText: link.displayText,
    file: file,
    otherPaths: [oldPath, newPath],
    sourcePath: source.path
  });

  if (newPath) {
    file = createTFileInstance(app.vault, newPath);
  }

  const newLink = generateMarkdownLink({
    app,
    file,
    sourcePath: source.path,
    subpath,
    alias,
    isEmbed,
    isWikilink
  });
  return newLink;
}

function getAlias({
  app,
  displayText,
  file,
  otherPaths,
  sourcePath
}: {
  app: App,
  displayText: string | undefined,
  file: TFile,
  otherPaths: (string | undefined)[]
  sourcePath: string
}): string | undefined {
  if (!displayText) {
    return undefined;
  }

  const cleanDisplayText = normalizePath(displayText.split(" > ")[0]!).replace(/\.\//g, "");

  for (const path of [file.path, ...otherPaths]) {
    if (!path) {
      continue;
    }
    const extension = extname(path);
    const fileNameWithExtension = basename(path);
    const fileNameWithoutExtension = basename(path, extension);
    if (cleanDisplayText === path || cleanDisplayText === fileNameWithExtension || cleanDisplayText === fileNameWithoutExtension) {
      return undefined;
    }
  }

  for (const omitMdExtension of [true, false]) {
    const linkText = app.metadataCache.fileToLinktext(file, sourcePath, omitMdExtension);
    if (cleanDisplayText === linkText) {
      return undefined;
    }
  }

  return displayText;
}
