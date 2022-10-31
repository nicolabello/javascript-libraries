import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { MDCTabBar } from '@material/tab-bar';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.mdc-tab-bar:not([mdc-no-auto-init])',
  exportAs: 'mdcTabBar',
})
export class TabBarDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCTabBar;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCTabBar(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
