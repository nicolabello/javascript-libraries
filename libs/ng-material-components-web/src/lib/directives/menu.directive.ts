import { AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy } from '@angular/core';

import { MDCMenu } from '@material/menu';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.mdc-menu:not([mdc-no-auto-init])',
  exportAs: 'mdcMenu',
})
export class MenuDirective implements AfterViewInit, OnDestroy {
  @Input() public anchorElement?: HTMLElement;

  public instance?: MDCMenu;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCMenu(this.elementRef.nativeElement);
    if (this.anchorElement) {
      this.instance.setAnchorElement(this.anchorElement);
    }
    this.instance.setAnchorMargin({ top: 10, left: 10, right: 10, bottom: 10 });
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }

  public toggle(open?: boolean): void {
    if (this.instance) {
      this.instance.open = open === true || open === false ? open : !this.instance.open;
    }
  }
}
