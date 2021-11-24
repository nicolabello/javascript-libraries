// https://medium.com/lacolaco-blog/angular-dynamic-importing-large-libraries-8ec079603d0

export function normalizeCommonJSImport<T>(
  importPromise: Promise<T>
): Promise<T> {
  // CommonJS's `module.exports` is wrapped as `default` in ESModule.
  return importPromise.then((m: any) => (m.default || m) as T);
}
