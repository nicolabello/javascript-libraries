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
  selector: '[nbSuspenseIfLoading]',
})
export class SuspenseIfLoadingDirective<T>
  extends SuspenseIfDirective<T>
  implements OnInit, OnDestroy
{
  @Input() public nbSuspenseIfLoadingOfType?: SuspenseInput<T>;

  constructor(
    templateRef: TemplateRef<SuspenseIfContext<T>>,
    viewContainer: ViewContainerRef,
    suspenseService: SuspenseService
  ) {
    super(templateRef, viewContainer, suspenseService);
  }

  public get isVisible(): boolean {
    return this.suspenseService.loading.booleanValue;
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
