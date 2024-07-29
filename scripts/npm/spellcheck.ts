import { execFromRoot } from "../tools/root.ts";

export default function spellcheck(): void {
  await execFromRoot("npx cspell . --no-progress");
}
