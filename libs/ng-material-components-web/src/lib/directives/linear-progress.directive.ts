import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MDCLinearProgress } from '@nicolabello/material-components-web';

@Directive({
  selector: '.mdc-linear-progress:not([mdc-no-auto-init])',
  exportAs: 'mdcLinearProgress',
})
export class LinearProgressDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCLinearProgress;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.instance = new MDCLinearProgress(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
