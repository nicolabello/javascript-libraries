import { AfterViewInit, Directive, ElementRef, EventEmitter, OnChanges, OnDestroy, Output } from '@angular/core';
import { MDCSelect } from '@material/select';
import { InputDirective } from '../helpers/input.directive';

@Directive({
  selector: '.mdc-select:not([mdc-no-auto-init])',
  exportAs: 'mdcSelect',
})
export class SelectDirective extends InputDirective<MDCSelect> implements AfterViewInit, OnChanges, OnDestroy {
  @Output() private valueChange = new EventEmitter<string>();

  constructor(private elementRef: ElementRef<HTMLElement>) {
    super();
  }

  public ngAfterViewInit(): void {
    this.instance = new MDCSelect(this.elementRef.nativeElement);
    this.instance.listen('MDCSelect:change', this.emitInstanceValue);
    this.updateMDCInstance();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.instance?.unlisten('MDCSelect:change', this.emitInstanceValue);
    this.instance?.destroy();
  }

  private emitInstanceValue = () => {
    this.valueChange.emit(this.instance?.value);
  };
}
