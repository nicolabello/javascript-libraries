export class Base64 {
  public static decode<T = any>(s: string): T | null {
    try {
      return JSON.parse(atob(s));
    } catch (e) {
      return null;
    }
  }

  public static encode<T>(value: T): string {
    return btoa(JSON.stringify(value));
  }
}
