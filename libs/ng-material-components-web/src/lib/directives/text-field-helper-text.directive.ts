import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

import { MDCTextFieldHelperText } from '@material/textfield';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.mdc-text-field-helper-text:not([mdc-no-auto-init])',
  exportAs: 'mdcTextFieldHelperText',
})
export class TextFieldHelperTextDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCTextFieldHelperText;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCTextFieldHelperText(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
