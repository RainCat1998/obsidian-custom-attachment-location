declare module "@jinder/path" {
  export const posix: {
    basename(path: string, ext?: string): string;
    dirname(path: string): string;
    extname(path: string): string;
    join(...paths: string[]): string;
  };
}
