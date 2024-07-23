import { execFromRoot } from "../tools/root.ts";

export default function lint(): void {
  execFromRoot("npx eslint . --fix");
}
