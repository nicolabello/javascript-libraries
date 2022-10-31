import { AfterViewInit, Directive, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';
import { MDCSwitch } from '@material/switch';
import { ToggleDirective } from '../helpers/toggle.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.mdc-switch:not([mdc-no-auto-init])',
  exportAs: 'mdcSwitch',
})
export class SwitchDirective extends ToggleDirective<MDCSwitch> implements AfterViewInit, OnDestroy {
  public instance?: MDCSwitch;

  private elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this.instance = new MDCSwitch(this.elementRef.nativeElement);
    this.updateMDCInstance();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.instance?.destroy();
  }

  @HostListener('click', ['$event'])
  private onHostClick(event: MouseEvent): void {
    event.stopImmediatePropagation();
  }
}
