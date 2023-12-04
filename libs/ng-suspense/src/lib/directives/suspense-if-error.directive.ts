import { Directive, Input, OnDestroy, OnInit } from '@angular/core';

import { SuspenseIfContext, SuspenseInput } from '../models/suspense';

import { SuspenseIfDirective } from './suspense-if.directive';

@Directive({
  selector: '[nbSuspenseIfError]',
})
export class SuspenseIfErrorDirective<T> extends SuspenseIfDirective<T> implements OnInit, OnDestroy {
  @Input() public nbSuspenseIfErrorOfType?: SuspenseInput<T>;

  public get isVisible(): boolean {
    return this.suspenseService.visibility.error;
  }

  public get value(): T {
    return this.suspenseService.error.value;
  }

  public static ngTemplateContextGuard<T>(
    dir: SuspenseIfErrorDirective<T>,
    ctx: unknown
  ): ctx is SuspenseIfContext<NonNullable<T>> {
    return true;
  }
}
