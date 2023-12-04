import { AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy } from '@angular/core';

import { MDCRipple } from '@material/ripple';

@Directive({
  selector: '[mdcRipple], .mdc-card__primary-action, .mdc-list-item, .mdc-fab, .mdc-button',
  exportAs: 'mdcRipple',
})
export class RippleDirective implements AfterViewInit, OnDestroy {
  @Input() private unbounded = false;

  public instance?: MDCRipple;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCRipple(this.elementRef.nativeElement);
    this.instance.unbounded = this.unbounded;
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
