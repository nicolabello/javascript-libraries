import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { MDCSelectHelperText } from '@material/select';

@Directive({
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
