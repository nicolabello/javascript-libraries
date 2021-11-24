import { ChangeDetectorRef, Directive, Host, Input, Optional, SkipSelf } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
  Validator,
  ValidatorFn
} from '@angular/forms';

/* In your child component add:
providers: [
  { provide: NG_VALUE_ACCESSOR, useExisting: MyComponent, multi: true },
  { provide: NG_VALIDATORS, useExisting: MyComponent, multi: true }
]
*/

const emptyFunction = () => {};

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class CommonValueAccessor<T> implements ControlValueAccessor, Validator {
  @Input() public formControlName?: string;
  protected validators: ValidatorFn[] = [];
  protected onChange: (value: T) => void = emptyFunction;
  protected onTouch: () => void = emptyFunction;
  protected onValidatorChange: () => void = emptyFunction;

  constructor(
    protected cdr: ChangeDetectorRef,
    // @Optional() private formGroupDirective: FormGroupDirective,
    // @Optional() private formGroupNameDirective: FormGroupName,
    @Host() @SkipSelf() @Optional() private controlContainer: ControlContainer
  ) {}

  // tslint:disable-next-line: no-input-rename
  @Input('formControl') private _formControl?: FormControl;

  public get formControl(): AbstractControl | null {
    // If instantiated with [formGroup] > formGroupName > formControlName
    // if (this.formGroupNameDirective && this.formControlName) {
    //   const control = this.formGroupNameDirective.control.get(this.formControlName);
    //   if (!control) {
    //     throw new Error(`CommonValueAccessor: unable to get the control '${this.formControlName}' from the parent 'formGroupName'`);
    //   }
    //   return control;
    // }

    // If instantiated with [formGroup] > formControlName
    // if (this.formGroupDirective && this.formControlName) {
    //   const control = this.formGroupDirective.control.get(this.formControlName);
    //   if (!control) {
    //     throw new Error(`CommonValueAccessor: unable to get the control '${this.formControlName}' from the parent 'formGroup'`);
    //   }
    //   return control;
    // }

    if (this.controlContainer?.control && this.formControlName) {
      const control = this.controlContainer.control.get(this.formControlName);
      if (!control) {
        throw new Error(
          `CommonValueAccessor: unable to get the control '${this.formControlName}' from the parent 'formGroup'`
        );
      }
      return control;
    }

    // If instantiated with [formControl]
    if (this._formControl) {
      return this._formControl;
    }

    // If instantiated with [(ngModel)]
    return new FormControl(this.value, this.validators);
  }

  private _disabled = false;

  public get disabled(): boolean {
    return this._disabled;
  }

  private _value?: T;

  public get value(): T {
    return this._value as T;
  }

  public set value(value: T) {
    if (value !== this._value) {
      this._value = value;
      this.onChange(value);
      this.onTouch();
      this.onValidatorChange();
    }
  }

  public get invalid(): boolean {
    return this.formControl?.invalid || false;
  }

  public get errors(): ValidationErrors | null {
    return this.formControl?.errors || null;
  }

  // Input for value
  public writeValue(value: any): void {
    this._value = this.formatValueInput(value);
    this.cdr.markForCheck();
  }

  public registerOnChange(onChange: (value: any) => void): void {
    // Output for value
    this.onChange = (value: T) => onChange(this.formatValueOutput(value));
  }

  public registerOnTouched(onTouched: () => void): void {
    // Output for touched
    this.onTouch = onTouched;
  }

  // Input for disabled
  public setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
  }

  public validate(control: FormControl): ValidationErrors | null {
    let errors = {};

    this.validators.forEach((validator) => {
      const result = validator(control);
      errors = result ? { ...errors, ...result } : errors;
    });

    return Object.keys(errors).length ? errors : null;
  }

  public registerOnValidatorChange(onValidatorChange: () => void): void {
    this.onValidatorChange = onValidatorChange;
  }

  protected formatValueInput(value: any): T {
    return value;
  }

  protected formatValueOutput(value: T): any {
    return value;
  }
}
