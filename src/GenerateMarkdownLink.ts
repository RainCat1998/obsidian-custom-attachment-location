import type {
  App,
  TFile
} from "obsidian";

export function generateMarkdownLink({
  app,
  file,
  sourcePath,
  subpath,
  alias,
  isEmbed,
  isWikilink,
  isRelative
}:
{
  app: App,
  file: TFile,
  sourcePath: string,
  subpath?: string | undefined,
  alias?: string | undefined,
  isEmbed?: boolean | undefined,
  isWikilink?: boolean | undefined,
  isRelative?: boolean | undefined
}): string {
  const useMarkdownLinks = app.vault.getConfig("useMarkdownLinks");
  const newLinkFormat = app.vault.getConfig("newLinkFormat");
  if (isWikilink !== undefined) {
    app.vault.setConfig("useMarkdownLinks", !isWikilink);
  }

  if (isRelative === true) {
    app.vault.setConfig("newLinkFormat", "relative");
  }

  let link = app.fileManager.generateMarkdownLink(file, sourcePath, subpath, alias);

  app.vault.setConfig("useMarkdownLinks", useMarkdownLinks);
  app.vault.setConfig("newLinkFormat", newLinkFormat);

  const isLinkEmbed = link.startsWith("!");

  if (isEmbed !== undefined && isEmbed !== isLinkEmbed) {
    if (isEmbed) {
      link = "!" + link;
    } else {
      link = link.slice(1);
      link = link.replace("[]", `[${alias || file.basename}]`);
    }
  }

  return link;
}
