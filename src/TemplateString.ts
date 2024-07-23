export default class TemplateString extends String {
  public interpolate(params: object): string {
    const names = Object.keys(params);
    const values: unknown[] = Object.values(params);
    const str = this as unknown as string;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(...names, `return \`${str}\`;`)(...values) as string;
  }
}
