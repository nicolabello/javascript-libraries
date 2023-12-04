import { Directive, ElementRef, OnDestroy } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { SubscriptionsBucket } from '@nicolabello/ng-helpers';

import { Size } from '../../models/size';
import { FlexContainerService } from '../../services/flex-container.service';
import { FlexPaneService } from '../../services/flex-pane.service';
import { FlexContainerDirective } from '../flex-container/flex-container.directive';

@Directive()
export abstract class FlexPaneDirective implements OnDestroy {
  public hostElement: HTMLElement;
  protected flexContainer: FlexContainerDirective;
  protected subscriptions = new SubscriptionsBucket();
  private innerSizeSubject = new ReplaySubject<Size>(1);

  public constructor(
    hostElementRef: ElementRef,
    flexContainerService: FlexContainerService,
    flexPaneService: FlexPaneService
  ) {
    this.hostElement = hostElementRef.nativeElement;
    this.hostElement.style.margin = '0';
    this.hostElement.style.boxSizing = 'border-box';

    flexPaneService.flexPane = this;
    this.flexContainer = flexContainerService.flexContainer; // horizontalFlexContainer || verticalFlexContainer;
  }

  public get innerSize(): Observable<Size> {
    return this.innerSizeSubject
      .asObservable()
      .pipe(distinctUntilChanged((before, after) => before.width === after.width && before.height === after.height));
  }

  public get innerWidth(): Observable<number> {
    return this.innerSizeSubject.asObservable().pipe(
      map((size) => size.width),
      distinctUntilChanged()
    );
  }

  public get width(): number {
    return this.hostElement.offsetWidth;
  }

  public set width(width: number) {
    this.hostElement.style.width = `${width}px`;
    this.propagateInnerSize();
  }

  public get height(): number {
    return this.hostElement.offsetHeight;
  }

  public set height(value: number) {
    this.hostElement.style.height = `${value}px`;
    this.propagateInnerSize();
  }

  public set position(value: string) {
    this.hostElement.style.position = value;
  }

  public set left(value: number) {
    this.hostElement.style.left = `${value}px`;
  }

  public set right(value: number) {
    this.hostElement.style.right = `${value}px`;
  }

  public get parentFlexPane(): FlexPaneDirective {
    return this.flexContainer.parentFlexPane;
  }

  public getInnerSize(): Size {
    return {
      width: this.hostElement.clientWidth,
      height: this.hostElement.clientHeight,
    };
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribeAll();
  }

  private propagateInnerSize(): void {
    this.innerSizeSubject.next(this.getInnerSize());
  }
}
