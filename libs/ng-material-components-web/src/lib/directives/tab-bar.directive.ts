import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MDCTabBar } from '@nicolabello/material-components-web';

@Directive({
  selector: '.mdc-tab-bar:not([mdc-no-auto-init])',
  exportAs: 'mdcTabBar',
})
export class TabBarDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCTabBar;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.instance = new MDCTabBar(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
