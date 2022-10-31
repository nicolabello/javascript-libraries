import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SuspenseIfContext, SuspenseInput } from '../models/suspense';
import { SuspenseIfDirective } from './suspense-if.directive';

@Directive({
  selector: '[nbSuspenseIfLoading]',
})
export class SuspenseIfLoadingDirective<T> extends SuspenseIfDirective<T> implements OnInit, OnDestroy {
  @Input() public nbSuspenseIfLoadingOfType?: SuspenseInput<T>;

  public get isVisible(): boolean {
    return this.suspenseService.visibility.loading;
  }

  public get value(): T {
    return this.suspenseService.loading.value;
  }

  public static ngTemplateContextGuard<T>(
    dir: SuspenseIfLoadingDirective<T>,
    ctx: unknown
  ): ctx is SuspenseIfContext<T> {
    return true;
  }
}
