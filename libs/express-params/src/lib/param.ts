import { Sanitizer } from './models/sanitizer';
import { Validator } from './models/validator';

export class Param {
  constructor(
    public readonly name: string,
    public readonly defaultValue?: any,
    public readonly sanitizers?: Sanitizer[],
    public readonly validators?: Validator[]
  ) {}
}
