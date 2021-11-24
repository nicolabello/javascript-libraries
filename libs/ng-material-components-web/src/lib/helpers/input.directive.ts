import { Directive, Input, OnChanges, OnDestroy } from '@angular/core';
import { updateMDCInputInstance } from './update-mdc-input-instance';
import { MDCInputComponent } from '../models/mdc-input-component';
import { AbstractControl, FormControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

@Directive()
export abstract class InputDirective<T extends MDCInputComponent>
  implements OnChanges, OnDestroy
{
  @Input() public required?: boolean;
  @Input() public disabled?: boolean;
  @Input() public invalid?: boolean;
  @Input() public value?: any;
  public instance?: T;
  private formControl: FormControl | null = null;
  private formControlSubscription?: Subscription;

  @Input()
  public set mdcFormControl(formControl: AbstractControl | null) {
    if (formControl && formControl instanceof FormControl) {
      if (this.formControl !== formControl) {
        this.formControl = formControl;
        this.formControlSubscription?.unsubscribe();
        this.formControlSubscription = merge(
          formControl.valueChanges.pipe(distinctUntilChanged()),
          formControl.statusChanges.pipe(distinctUntilChanged())
        )
          .pipe(tap(() => this.updateMDCInstance()))
          .subscribe();
      }
    } else {
      this.formControlSubscription?.unsubscribe();
      this.formControl = null;
    }
    this.updateMDCInstance();
  }

  public updateMDCInstance(): void {
    if (this.formControl) {
      updateMDCInputInstance(this.instance, {
        required: !!this.required,
        disabled: this.formControl.disabled,
        valid: !(
          this.formControl.invalid &&
          (this.formControl.dirty || this.formControl.touched)
        ),
        value: this.formControl.value,
      });
    } else {
      updateMDCInputInstance(this.instance, {
        required: !!this.required,
        disabled: !!this.disabled,
        valid: !this.invalid,
        value: this.value,
      });
    }
  }

  public ngOnChanges(): void {
    this.updateMDCInstance();
  }

  public ngOnDestroy(): void {
    this.formControlSubscription?.unsubscribe();
  }
}
