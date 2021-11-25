import { ValidationErrors } from './models/validation-errors';

export class Validators {
  public static required(value: any): ValidationErrors | null {
    if (!value && value !== 0) {
      return { required: true };
    }
    return null;
  }
}
