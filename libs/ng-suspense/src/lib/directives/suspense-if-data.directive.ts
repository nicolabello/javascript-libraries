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
  selector: '[nbSuspenseIfData]',
})
export class SuspenseIfDataDirective<T>
  extends SuspenseIfDirective<T>
  implements OnInit, OnDestroy
{
  @Input() public nbSuspenseIfDataOfType?: SuspenseInput<T>;

  constructor(
    templateRef: TemplateRef<SuspenseIfContext<NonNullable<T>>>,
    viewContainer: ViewContainerRef,
    suspenseService: SuspenseService
  ) {
    super(templateRef, viewContainer, suspenseService);
  }

  public get isVisible(): boolean {
    return this.suspenseService.visibility.data
  }

  public get value(): T {
    return this.suspenseService.data.value;
  }

  public static ngTemplateContextGuard<T>(
    dir: SuspenseIfDataDirective<T>,
    ctx: unknown
  ): ctx is SuspenseIfContext<NonNullable<T>> {
    return true;
  }
}
