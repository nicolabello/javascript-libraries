import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { MDCTextField } from '@nicolabello/material-components-web';
import { InputDirective } from '../helpers/input.directive';

@Directive({
  selector: '.mdc-text-field',
  exportAs: 'mdcTextField',
})
export class TextFieldDirective
  extends InputDirective<MDCTextField>
  implements AfterViewInit, OnChanges, OnDestroy
{
  constructor(private elementRef: ElementRef<HTMLElement>) {
    super();
  }

  public ngAfterViewInit(): void {
    this.instance = new MDCTextField(this.elementRef.nativeElement);
    this.instance.useNativeValidation = false;
    this.updateMDCInstance();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.instance?.destroy();
  }
}
