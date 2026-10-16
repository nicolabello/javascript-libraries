import {
  ChangeDetectorRef,
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

class Context<T> {
  public nbSubscribe?: T;
}

// Use as <ng-container *nbSubscribe="interval$ as value;">{{ value }}</ng-container>
// https://netbasal.com/diy-subscription-handling-directive-in-angular-c8f6e762697f
@Directive({ selector: '[nbSubscribe]' })
export class SubscribeDirective<T> implements OnInit, OnDestroy {
  private viewContainer = inject(ViewContainerRef);
  private cdr = inject(ChangeDetectorRef);
  private templateRef = inject<TemplateRef<Context<T>>>(TemplateRef);

  private observable?: Observable<T>;
  private context: Context<T> = new Context();
  private subscription?: Subscription;

  @Input()
  public set nbSubscribe(observable: Observable<T>) {
    if (observable !== this.observable) {
      this.observable = observable;
      this.subscription?.unsubscribe();
      this.subscription = this.observable.subscribe((value) => {
        this.context.nbSubscribe = value;
        this.cdr.markForCheck();
      });
    }
  }

  public static ngTemplateContextGuard<T>(dir: SubscribeDirective<T>, ctx: unknown): ctx is Context<T> {
    return true;
  }

  public ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
