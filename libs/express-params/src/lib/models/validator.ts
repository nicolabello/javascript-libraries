import { ValidationErrors } from './validation-errors';

export type Validator = (value: any) => ValidationErrors | null;
