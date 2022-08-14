import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import {MDCCircularProgress} from '@material/circular-progress';

@Directive({
  selector: '.mdc-circular-progress:not([mdc-no-auto-init])',
  exportAs: 'mdcCircularProgress',
})
export class CircularProgressDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCCircularProgress;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.instance = new MDCCircularProgress(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
