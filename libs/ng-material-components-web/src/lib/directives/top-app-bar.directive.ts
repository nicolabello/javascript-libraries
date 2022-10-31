import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { MDCTopAppBar } from '@material/top-app-bar';

@Directive({
  selector: '.mdc-top-app-bar:not([mdc-no-auto-init])',
  exportAs: 'mdcTopAppBar',
})
export class TopAppBarDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCTopAppBar;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCTopAppBar(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
