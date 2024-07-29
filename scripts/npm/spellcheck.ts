import { execFromRoot } from "../tools/root.ts";

export default async function spellcheck(): Promise<void> {
  await execFromRoot("npx cspell . --no-progress");
}
