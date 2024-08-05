import type {
  App,
  TFile
} from "obsidian";

export function generateMarkdownLink(app: App, file: TFile, sourcePath: string, subpath?: string, alias?: string, isEmbed?: boolean, isWikilink?: boolean): string {
  const useMarkdownLinks = app.vault.getConfig("useMarkdownLinks");
  if (isWikilink !== undefined) {
    app.vault.setConfig("useMarkdownLinks", !isWikilink);
  }

  let link = app.fileManager.generateMarkdownLink(file, sourcePath, subpath, alias);

  app.vault.setConfig("useMarkdownLinks", useMarkdownLinks);

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

