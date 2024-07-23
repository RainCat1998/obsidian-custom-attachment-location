import { execFromRoot } from "../tools/root.ts";

export default function spellcheck(): void {
  execFromRoot("npx cspell . --no-progress");
}
