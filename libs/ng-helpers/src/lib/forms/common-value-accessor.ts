import { ChangeDetectorRef, Directive, DoCheck, inject, Input } from '@angular/core';
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

const emptyFunction = (): undefined => undefined;

@Directive()
// T = FormControl type, U = UI type
export class CommonValueAccessor<T, U = T> implements ControlValueAccessor, Validator, DoCheck {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('formControl') private _formControl?: FormControl<T>;
  @Input() public formControlName?: string;

  private controlContainer = inject(ControlContainer, { host: true, skipSelf: true, optional: true });
  private localFormControl?: FormControl<T>;
  private isLocalFormControlCustom = false;

  protected cdr = inject(ChangeDetectorRef);

  protected validators: ValidatorFn[] = [];
  protected onChange: (value: U | undefined) => void = emptyFunction;
  protected onTouched: () => void = emptyFunction;
  protected onValidatorChange: () => void = emptyFunction;

  public get formControl(): FormControl<T> {
    this.initFormControl();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.localFormControl!;
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
      this.onValidatorChange();
    }
  }

  private _errorsVisible = false;

  private initFormControl(): void {
    if (!this.localFormControl) {
      if (this.controlContainer?.control && this.formControlName) {
        this.localFormControl = this.controlContainer.control.get(this.formControlName) as FormControl<T>;
        this.isLocalFormControlCustom = false;
        if (!this.localFormControl) {
          throw new Error(
            `CommonValueAccessor: unable to get the control '${this.formControlName}' from the parent 'formGroup'`
          );
        }
        return;
      }

      // If instantiated with [formControl]
      if (this._formControl) {
        this.localFormControl = this._formControl;
        this.isLocalFormControlCustom = false;
        return;
      }

      // If instantiated with [(ngModel)]
      const value = this.formatValueOutput(this.value);
      this.localFormControl = new FormControl<T>(value, this.validators) as FormControl<T>;
      this.isLocalFormControlCustom = true;
    }
  }

  public onBlur(): void {
    this.onTouched();
  }

  public get invalid(): boolean {
    return this.formControl?.invalid || false;
  }

  public get errorsVisible(): boolean {
    return this.formControl?.invalid && (this.formControl?.dirty || this.formControl?.touched);
  }

  public get errors(): ValidationErrors | null {
    return this.formControl?.errors || null;
  }

  public getError<T extends Record<string, unknown> = Record<string, unknown>>(
    priority?: string[]
  ): {
    key: string;
    details: T;
  } | void {
    const errors = this.errors;

    if (!errors) {
      return;
    }

    if (priority?.length) {
      for (const key of priority) {
        if (errors[key]) {
          return {
            key: key,
            details: errors[key],
          };
        }
      }
    }

    for (const key of Object.keys(errors)) {
      return {
        key: key,
        details: errors[key],
      };
    }
  }

  // Input for value
  public writeValue(value: T): void {
    this._value = this.formatValueInput(value);
    this.cdr.markForCheck();
  }

  public registerOnChange(onChange: (value: T) => void): void {
    // Output for value
    this.onChange = (value: U | undefined): void => {
      const formattedValue = this.formatValueOutput(value);

      this.initFormControl();
      if (this.isLocalFormControlCustom) {
        this.localFormControl?.setValue(formattedValue);
      }

      onChange(formattedValue);
    };
  }

  public registerOnTouched(onTouched: () => void): void {
    // Output for touched
    this.onTouched = (): void => {
      this.initFormControl();
      if (this.isLocalFormControlCustom) {
        this.localFormControl?.markAsTouched();
      }

      onTouched();
    };
  }

  // Input for disabled
  public setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
    this.cdr.markForCheck();
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

  public ngDoCheck(): void {
    const errorsVisible = this.errorsVisible;
    if (errorsVisible !== this._errorsVisible) {
      this._errorsVisible = errorsVisible;
      this.errorsVisibilityChange(errorsVisible);
    }
  }

  protected formatValueInput(value: T): U {
    return value as unknown as U;
  }

  protected formatValueOutput(value: U | undefined): T {
    return value as unknown as T;
  }

  protected errorsVisibilityChange(value: boolean): void {
    return;
  }
}
