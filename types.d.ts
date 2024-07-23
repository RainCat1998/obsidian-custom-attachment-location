export { };

declare module 'obsidian' {
	interface App {
		saveAttachment(path: string, extension: string, data: ArrayBuffer): Promise<TFile>;
	}
}
