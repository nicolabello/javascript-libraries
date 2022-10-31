import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { MDCRipple } from '@material/ripple';

@Directive({
  selector: '.mdc-icon-button',
  exportAs: 'mdcRipple',
})
export class RippleUnboundedDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCRipple;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCRipple(this.elementRef.nativeElement);
    this.instance.unbounded = true;
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
