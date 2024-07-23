import buildPlugin, { BuildMode } from "../buildPlugin.ts";

export default async function build(): Promise<void> {
  await buildPlugin({ mode: BuildMode.Production });
}
