import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MDCTextFieldHelperText } from '@material/textfield';

@Directive({
  selector: '.mdc-text-field-helper-text:not([mdc-no-auto-init])',
  exportAs: 'mdcTextFieldHelperText',
})
export class TextFieldHelperTextDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCTextFieldHelperText;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.instance = new MDCTextFieldHelperText(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
