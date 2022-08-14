import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MDCSelectHelperText } from '@material/select';

@Directive({
  selector: '.mdc-select-helper-text:not([mdc-no-auto-init])',
  exportAs: 'mdcSelectHelperText',
})
export class SelectHelperTextDirective implements AfterViewInit, OnDestroy {
  public instance?: MDCSelectHelperText;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.instance = new MDCSelectHelperText(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
