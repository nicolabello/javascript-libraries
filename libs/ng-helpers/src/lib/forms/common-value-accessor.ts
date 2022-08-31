import { ChangeDetectorRef, Directive, Host, Input, Optional, SkipSelf } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

/* In your child component MyComponent add:
providers: [
  { provide: NG_VALUE_ACCESSOR, useExisting: MyComponent, multi: true },
  { provide: NG_VALIDATORS, useExisting: MyComponent, multi: true }
]
*/

const emptyFunction = () => undefined;

@Directive()
// T = FormControl type, U = UI type
export class CommonValueAccessor<T, U = T> implements ControlValueAccessor, Validator {
  // tslint:disable-next-line: no-input-rename
  @Input('formControl') private _formControl?: FormControl<T>;
  @Input() public formControlName?: string;

  protected validators: ValidatorFn[] = [];
  protected onChange: (value: U | undefined) => void = emptyFunction;
  protected onTouch: () => void = emptyFunction;
  protected onValidatorChange: () => void = emptyFunction;

  constructor(
    protected cdr: ChangeDetectorRef,
    @Host() @SkipSelf() @Optional() private controlContainer: ControlContainer
  ) {}

  public get formControl(): FormControl<T> {
    if (this.controlContainer?.control && this.formControlName) {
      const control = this.controlContainer.control.get(this.formControlName);
      if (!control) {
        throw new Error(
          `CommonValueAccessor: unable to get the control '${this.formControlName}' from the parent 'formGroup'`
        );
      }
      return control as FormControl<T>;
    }

    // If instantiated with [formControl]
    if (this._formControl) {
      return this._formControl;
    }

    // If instantiated with [(ngModel)]
    const value = this.formatValueOutput(this.value);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new FormControl<T>(value, this.validators);
  }

  private _disabled = false;

  public get disabled(): boolean {
    return this._disabled;
  }

  private _value: U | undefined;

  public get value(): U | undefined {
    return this._value;
  }

  public set value(value: U | undefined) {
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
  public writeValue(value: T): void {
    this._value = this.formatValueInput(value);
    this.cdr.markForCheck();
  }

  public registerOnChange(onChange: (value: any) => void): void {
    // Output for value
    this.onChange = (value: U | undefined) => onChange(this.formatValueOutput(value));
  }

  public registerOnTouched(onTouched: () => void): void {
    // Output for touched
    this.onTouch = onTouched;
  }

  // Input for disabled
  public setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
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

  protected formatValueInput(value: T): U {
    return value as unknown as U;
  }

  protected formatValueOutput(value: U | undefined): T {
    return value as unknown as T;
  }
}
