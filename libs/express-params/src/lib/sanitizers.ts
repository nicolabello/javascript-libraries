import { Typings } from '@nicolabello/js-helpers';

export class Sanitizers {
  public static toString(value: any): string {
    return Typings.toString(value);
  }

  public static toBoolean(value: any): boolean {
    if (typeof value === 'string') {
      return value.trim().toLowerCase() === 'true';
    }
    return value === true;
  }
}
