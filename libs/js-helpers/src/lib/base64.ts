function toBinaryString(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return binary;
}

function fromBinaryString(binary: string): string {
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    // Not valid UTF-8: value was encoded as Latin-1 by a previous version
    return binary;
  }
}

/**
 * Encodes any JSON-serialisable value to a Base64 string and back.
 * Unicode-safe: strings are encoded as UTF-8 before Base64 encoding.
 */
export class Base64 {
  public static decode<T = any>(s: string): T | null {
    try {
      return JSON.parse(fromBinaryString(atob(s)));
    } catch {
      return null;
    }
  }

  public static encode<T>(value: T): string {
    return btoa(toBinaryString(JSON.stringify(value)));
  }
}
