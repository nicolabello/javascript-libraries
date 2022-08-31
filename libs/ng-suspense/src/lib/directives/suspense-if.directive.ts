import { Directive, EmbeddedViewRef, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuspenseService } from '../services/suspense.service';
import { SuspenseIfContext } from '../models/suspense';

@Directive()
export abstract class SuspenseIfDirective<T> implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private embeddedViewRef: EmbeddedViewRef<SuspenseIfContext<T>> | null = null;

  constructor(
    protected templateRef: TemplateRef<SuspenseIfContext<T>>,
    protected viewContainer: ViewContainerRef,
    protected suspenseService: SuspenseService
  ) {}

  public abstract get isVisible(): boolean;

  public abstract get value(): T;

  public ngOnInit(): void {
    this.subscriptions.add(this.suspenseService.valuesChanges.subscribe(() => this.updateView()));
    this.updateView();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateView(): void {
    if (this.isVisible) {
      const context = new SuspenseIfContext<T>(this.value);

      if (this.embeddedViewRef) {
        this.embeddedViewRef.context = context;
      } else {
        this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, context);
      }
    } else if (this.embeddedViewRef) {
      this.viewContainer.clear();
      this.embeddedViewRef = null;
    }
  }
}
