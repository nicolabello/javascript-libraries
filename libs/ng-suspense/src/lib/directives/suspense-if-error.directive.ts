import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { SuspenseIfContext, SuspenseInput } from '../models/suspense';
import { SuspenseIfDirective } from './suspense-if.directive';
import { SuspenseService } from '../services/suspense.service';

@Directive({
  selector: '[nbSuspenseIfError]',
})
export class SuspenseIfErrorDirective<T>
  extends SuspenseIfDirective<T>
  implements OnInit, OnDestroy
{
  @Input() public nbSuspenseIfErrorOfType?: SuspenseInput<T>;

  constructor(
    templateRef: TemplateRef<SuspenseIfContext<NonNullable<T>>>,
    viewContainer: ViewContainerRef,
    suspenseService: SuspenseService
  ) {
    super(templateRef, viewContainer, suspenseService);
  }

  public get isVisible(): boolean {
    return (
      !this.suspenseService.loading.booleanValue &&
      this.suspenseService.error.booleanValue
    );
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
