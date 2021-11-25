export function isNodeEnvProduction(): boolean {
  return !!process.env.NODE_ENV?.match(/prod/gi);
}
