import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { MDCSelectHelperText } from '@material/select';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.mdc-select-helper-text:not([mdc-no-auto-init])',
  exportAs: 'mdcSelectHelperText',
})
export class SelectHelperTextDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCSelectHelperText;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCSelectHelperText(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
