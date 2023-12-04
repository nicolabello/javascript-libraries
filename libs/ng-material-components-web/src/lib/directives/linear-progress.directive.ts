import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

import { MDCLinearProgress } from '@material/linear-progress';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.mdc-linear-progress:not([mdc-no-auto-init])',
  exportAs: 'mdcLinearProgress',
})
export class LinearProgressDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCLinearProgress;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCLinearProgress(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
