import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

import { MDCCircularProgress } from '@material/circular-progress';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.mdc-circular-progress:not([mdc-no-auto-init])',
  exportAs: 'mdcCircularProgress',
})
export class CircularProgressDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCCircularProgress;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCCircularProgress(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
