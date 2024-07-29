import { execFromRoot } from "../tools/root.ts";

export default async function lint(): Promise<void> {
  await execFromRoot("npx eslint . --fix");
}
