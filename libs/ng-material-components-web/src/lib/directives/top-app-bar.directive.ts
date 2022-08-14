import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MDCTopAppBar } from '@material/top-app-bar';

@Directive({
  selector: '.mdc-top-app-bar:not([mdc-no-auto-init])',
  exportAs: 'mdcTopAppBar',
})
export class TopAppBarDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCTopAppBar;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.instance = new MDCTopAppBar(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
