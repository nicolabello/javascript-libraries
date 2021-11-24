import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export type SuspenseInput<T> = T | Observable<T> | Promise<T>;

export type SuspenseData = any;
export type SuspenseLoading = boolean | any;
export type SuspenseError = boolean | string | HttpErrorResponse | any;

export class SuspenseIfContext<T> {
  public readonly $implicit: T;

  constructor(value: T) {
    this.$implicit = value;
  }
}
