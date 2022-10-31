import { Directive, EmbeddedViewRef, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuspenseIfContext } from '../models/suspense';
import { SuspenseService } from '../services/suspense.service';

@Directive()
export abstract class SuspenseIfDirective<T> implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private embeddedViewRef: EmbeddedViewRef<SuspenseIfContext<T>> | null = null;

  protected templateRef = inject<TemplateRef<SuspenseIfContext<T>>>(TemplateRef);
  protected viewContainer = inject(ViewContainerRef);
  protected suspenseService = inject(SuspenseService);

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
