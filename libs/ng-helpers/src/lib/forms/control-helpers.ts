import { AbstractControl, FormControl, FormControlStatus, FormGroup, ValidationErrors } from '@angular/forms';

export interface ControlErrors {
  field: string;
  status: FormControlStatus;
  enabled: boolean;
  errors: ValidationErrors | null;
}

export class ControlHelpers {
  private static _getErrorsRecursively(
    control: AbstractControl,
    path: string = '',
    errors: ControlErrors[] = []
  ): ControlErrors[] {
    if (control) {
      if (control instanceof FormControl) {
        if (control.invalid) {
          errors.push({ field: path, status: control.status, enabled: control.enabled, errors: control.errors });
        }
      } else if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((name) => {
          const childControl = control.get(name);

          if (childControl) {
            this._getErrorsRecursively(childControl, path ? `${path}.${name}` : name, errors);
          }
        });
      }
    }
    return errors;
  }

  public static getErrorsRecursively(control: AbstractControl): ControlErrors[] {
    return this._getErrorsRecursively(control);
  }

  private static _getDisabledFields(form: FormGroup, disabledPaths: string[] = [], parentPath?: string): string[] {
    Object.keys(form.controls).forEach((name) => {
      const control = form.get(name);
      const path = parentPath ? `${parentPath}.${name}` : name;

      if (control?.disabled) {
        disabledPaths.push(path);
      } else if (control instanceof FormGroup) {
        this._getDisabledFields(control, disabledPaths, path);
      }
    });

    return disabledPaths;
  }

  public static temporaryDisableFormGroup(form: FormGroup): string[] {
    const previouslyDisabledFields = this._getDisabledFields(form);

    // Disable the whole form
    form.disable({ emitEvent: false });

    return previouslyDisabledFields;
  }

  public static enableTemporaryDisabledFormGroup(form: FormGroup, previouslyDisabledFields: string[]): void {
    // Enable the whole form
    form.enable({ emitEvent: false });

    // Disable previously disabled fields
    previouslyDisabledFields.forEach((field) => form.get(field)?.disable({ emitEvent: false }));
  }
}
