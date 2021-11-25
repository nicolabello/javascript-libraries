export function deepValue(object: { [key: string]: any }, path: string): any {
  return path
    .replace(/\[|]\.?/g, '.')
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s)
    .reduce((currentObject, attribute) => currentObject?.[attribute], object);
}
