import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { fromResizeObserver, SubscriptionsBucket } from '@nicolabello/ng-helpers';

import { Size } from '../../models/size';
import { FlexContainerService } from '../../services/flex-container.service';
import { FlexPaneService } from '../../services/flex-pane.service';
import { FlexRootService } from '../../services/flex-root.service';
import { FlexPaneDynamicDirective } from '../flex-pane/flex-pane-dynamic.directive';
import { FlexPaneFixedDirective } from '../flex-pane/flex-pane-fixed.directive';
import { FlexPaneDirective } from '../flex-pane/flex-pane.directive';

@Directive()
export abstract class FlexContainerDirective implements OnInit, OnDestroy {
  @Input() public fromRootContainer?: boolean;
  protected fixedPanesBefore: FlexPaneFixedDirective[] = [];
  protected dynamicPane?: FlexPaneDynamicDirective;
  protected fixedPanesAfter: FlexPaneFixedDirective[] = [];
  private subscriptions = new SubscriptionsBucket();
  private parentElement!: HTMLElement;
  private hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private flexPaneService = inject(FlexPaneService, { optional: true });
  private flexRootService = inject(FlexRootService);

  public constructor() {
    inject(FlexContainerService).flexContainer = this;

    this.hostElement.style.margin = '0';
    // this.hostElement.style.boxSizing = 'border-box';
    this.hostElement.style.padding = '0';
    this.hostElement.style.border = '0';
  }

  private _parentFlexPane!: FlexPaneDirective;

  public get parentFlexPane(): FlexPaneDirective {
    return this._parentFlexPane;
  }

  private get parentElementInnerSize(): Size {
    return {
      width: this.parentElement.clientWidth,
      height: this.parentElement.clientHeight,
    };
  }

  public ngOnInit(): void {
    const flexPaneService = this.fromRootContainer ? null : this.flexPaneService;
    this.fromRootContainer = !flexPaneService;
    let observable: Observable<Size>;

    if (!flexPaneService) {
      this.parentElement = this.flexRootService.hostElement;
      observable = fromResizeObserver(this.parentElement).pipe(
        map(() => this.parentElementInnerSize),
        distinctUntilChanged((before, after) => before.width === after.width && before.height === after.height)
      );
    } else {
      this._parentFlexPane = flexPaneService.flexPane;
      this.parentElement = this._parentFlexPane.hostElement;
      observable = this._parentFlexPane.innerSize;
    }

    // Set to 'hidden' to detect the proper size and then set to 'visible' after first update
    this.parentElement.style.overflow = 'hidden';
    this.parentElement.style.padding = '0';

    this.subscriptions.push(observable.subscribe((size) => this.update(size)));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribeAll();
  }

  public addFixedPane(flexPane: FlexPaneFixedDirective): void {
    if (!this.dynamicPane) {
      this.fixedPanesBefore.push(flexPane);
    } else {
      this.fixedPanesAfter.push(flexPane);
    }
    this.update();
  }

  public removeFixedPane(flexPane: FlexPaneFixedDirective): void {
    let i = this.fixedPanesBefore.indexOf(flexPane);
    if (i > -1) {
      this.fixedPanesBefore.splice(i, 1);
      this.update();
      return;
    }
    i = this.fixedPanesAfter.indexOf(flexPane);
    if (i > -1) {
      this.fixedPanesAfter.splice(i, 1);
      this.update();
      return;
    }
  }

  public forceUpdate(): void {
    this.update();
  }

  public setDynamicPane(flexPane: FlexPaneDynamicDirective): void {
    this.dynamicPane = flexPane;
    this.update();
  }

  public unsetDynamicPane(flexPane: FlexPaneDirective): void {
    if (this.dynamicPane === flexPane) {
      this.dynamicPane = undefined;
      this.update();
    }
  }

  protected abstract updateChildren(size: Size): void;

  private update(size = this.parentElementInnerSize): void {
    this.hostElement.style.width = `${size.width}px`;
    this.hostElement.style.height = `${size.height}px`;

    this.updateChildren(size);

    if (!this.fromRootContainer) {
      this.parentElement.style.overflow = 'visible';
    }
  }
}
