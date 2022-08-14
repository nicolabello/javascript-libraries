import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MDCRipple } from '@material/ripple';

@Directive({
  selector:
    '[mdcRipple], .mdc-card__primary-action, .mdc-list-item, .mdc-fab, .mdc-icon-button, .mdc-button',
  exportAs: 'mdcRipple',
})
export class RippleDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCRipple;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.instance = new MDCRipple(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
