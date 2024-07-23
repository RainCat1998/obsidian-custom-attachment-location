import { Notice } from "obsidian";

export function showError(error: unknown): void {
  console.error(error);
  new Notice("An unhandled error occurred. Please check the console for more information.");
}
