declare module "globals" {
  interface Globals {
    [name: string]: boolean | "writable" | "readonly" | "off";
  }

  const globals: {
    browser: Globals;
    node: Globals;
  };
  export default globals;
}
