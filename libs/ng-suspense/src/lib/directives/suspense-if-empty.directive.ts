import { Directive, Input, OnDestroy, OnInit } from '@angular/core';

import { SuspenseIfContext, SuspenseInput } from '../models/suspense';

import { SuspenseIfDirective } from './suspense-if.directive';

@Directive({
  selector: '[nbSuspenseIfEmpty]',
})
export class SuspenseIfEmptyDirective<T> extends SuspenseIfDirective<T> implements OnInit, OnDestroy {
  @Input() public nbSuspenseIfEmptyOfType?: SuspenseInput<T>;

  public get isVisible(): boolean {
    return this.suspenseService.visibility.empty;
  }

  public get value(): T {
    return this.suspenseService.data.value;
  }

  public static ngTemplateContextGuard<T>(dir: SuspenseIfEmptyDirective<T>, ctx: unknown): ctx is SuspenseIfContext<T> {
    return true;
  }
}
