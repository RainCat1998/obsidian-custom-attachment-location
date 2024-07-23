import buildPlugin, { BuildMode } from "../buildPlugin.ts";

export default async function dev(): Promise<void> {
  await buildPlugin({ mode: BuildMode.Development });
}

export const isLongRunning = true;
