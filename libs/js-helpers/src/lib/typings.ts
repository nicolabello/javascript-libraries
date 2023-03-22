export class Typings {
  public static isDefined(value: any): boolean {
    return typeof value !== 'undefined';
  }

  public static isString(value: any): value is string {
    return typeof value === 'string';
  }

  public static isNumber(value: any): value is number {
    return typeof value === 'number' && isFinite(value);
  }

  public static isBoolean(value: any): value is boolean {
    return value === true || value === false;
  }

  public static isArray(value: any): value is any[] {
    return Array.isArray(value);
  }

  public static isFunction(value: any): value is () => any {
    return typeof value === 'function';
  }

  public static isObject(value: any): value is { [key: string]: any } {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  public static toString(value: any): string {
    return this.isDefined(value) && value !== null ? `${value}` : '';
  }
}
