interface Params {
  [key: string]: any;
}

export class Base64 {
  public static decode(params: string): Params | null {
    try {
      return JSON.parse(atob(params));
    } catch (e) {
      return null;
    }
  }

  public static encode(params: Params): string {
    return btoa(JSON.stringify(params));
  }
}
