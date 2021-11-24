import { Params } from '@angular/router';

export type Subview = any;

export interface SubviewWithParams<T = Subview, U = Params> {
  subview: T;
  params: U | null;
}
