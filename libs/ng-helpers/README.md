# @nicolabello/ng-helpers

[![npm](https://img.shields.io/npm/v/@nicolabello/ng-helpers.svg)](https://www.npmjs.com/package/@nicolabello/ng-helpers)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

A collection of Angular helpers:

- [`CommonValueAccessor`](#commonvalueaccessor): a base class to build custom form controls that work with `ngModel`, `formControl` and `formControlName`
- [`ControlHelpers`](#controlhelpers): collect form errors and temporarily disable forms
- [`*nbSubscribe`](#nbsubscribe): subscribe to an Observable in a template
- [RxJS helpers](#rxjs-helpers): `fromResizeObserver`, `fromMutationObserver`, `fromIntersectionObserver`, `catchSwitchMapError`, `SubscriptionsBucket`
- [DOM helpers](#dom-helpers): `Device`, `Dom`, `normalizeCommonJSImport`

## Compatibility

| @nicolabello/ng-helpers | Angular |
| ----------------------- | ------- |
| 3.x                     | 22      |
| 2.x                     | 18      |

## Installation

```bash
npm install @nicolabello/ng-helpers
```

## Forms

### `CommonValueAccessor`

`CommonValueAccessor<T, U = T>` implements `ControlValueAccessor` and `Validator`, so a custom input only has to deal with its UI. `T` is the type of the form value and `U` the type used by the UI (they can differ, see formatters below).

```ts
import { Component } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { CommonValueAccessor } from '@nicolabello/ng-helpers';

@Component({
  selector: 'app-text-input',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: TextInputComponent, multi: true },
  ],
  template: `
    <input [value]="value ?? ''" [disabled]="disabled" (input)="value = $any($event.target).value" (blur)="onBlur()" />
    @if (errorsVisible) {
      <small>{{ getError(['required'])?.key }}</small>
    }
  `,
})
export class TextInputComponent extends CommonValueAccessor<string> {
  // Validators applied to the control, in addition to the ones of the parent form
  protected override validators = [Validators.maxLength(50)];
}
```

It works with any forms API:

```html
<app-text-input [(ngModel)]="name" />
<app-text-input [formControl]="nameControl" />
<form [formGroup]="form">
  <app-text-input formControlName="name" />
</form>
```

Members available to subclasses and templates:

| Member                      | Description                                                                    |
| --------------------------- | ------------------------------------------------------------------------------ |
| `value`                     | The UI value. Setting it notifies the form (`onChange`) and re-runs validation |
| `disabled`                  | Whether the control is disabled                                                |
| `formControl`               | The bound `FormControl` (also available with `ngModel`)                        |
| `invalid` / `errors`        | Validation state of the control                                                |
| `errorsVisible`             | `true` when the control is invalid and dirty or touched                        |
| `getError(priority?)`       | The first error as `{ key, details }`, checking the keys in `priority` first   |
| `onBlur()`                  | Call it on blur to mark the control as touched                                 |
| `validators`                | `ValidatorFn[]` run by the control itself                                      |
| `formatValueInput(value)`   | Override to convert the form value (`T`) to the UI value (`U`)                 |
| `formatValueOutput(value)`  | Override to convert the UI value (`U`) to the form value (`T`)                 |
| `errorsVisibilityChange(v)` | Override to react when `errorsVisible` changes                                 |

For example, a control whose form value is a `number` (in cents) and whose UI value is a `string`:

```ts
export class PriceInputComponent extends CommonValueAccessor<number | null, string> {
  protected override formatValueInput(cents: number | null): string {
    return cents === null ? '' : (cents / 100).toFixed(2);
  }

  protected override formatValueOutput(value: string | undefined): number | null {
    return value ? Math.round(parseFloat(value) * 100) : null;
  }
}
```

### `ControlHelpers`

| Method                                                                            | Description                                                                                                             |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ControlHelpers.getErrorsRecursively(control)`                                    | Returns `{ field, status, enabled, errors }[]` for every invalid `FormControl`, with dotted paths (e.g. `address.city`) |
| `ControlHelpers.temporaryDisableFormGroup(form)`                                  | Disables the whole form (e.g. while saving) and returns the paths of the fields that were already disabled              |
| `ControlHelpers.enableTemporaryDisabledFormGroup(form, previouslyDisabledFields)` | Re-enables the form, keeping the previously disabled fields disabled                                                    |

```ts
const disabledFields = ControlHelpers.temporaryDisableFormGroup(this.form);
this.api.save(this.form.getRawValue()).subscribe({
  complete: () => ControlHelpers.enableTemporaryDisabledFormGroup(this.form, disabledFields),
});
```

## `*nbSubscribe`

Subscribes to an Observable and exposes its latest value, rendering the template straight away (unlike `@if (obs$ | async; as value)`, falsy values such as `0` or `''` are rendered too).

```ts
import { SubscribeDirective } from '@nicolabello/ng-helpers';

@Component({
  imports: [SubscribeDirective],
  template: `<ng-container *nbSubscribe="counter$ as count">Count: {{ count }}</ng-container>`,
})
export class CounterComponent {
  public counter$ = interval(1000);
}
```

`SubscribeModule` is also available for NgModule-based code.

## RxJS helpers

| Helper                                        | Description                                                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `fromResizeObserver(element, options?)`       | Emits a `ResizeObserverEntry` when the element is resized (falls back to the window `resize` event)              |
| `fromMutationObserver(node, options?)`        | Emits a `MutationRecord` for each DOM mutation                                                                   |
| `fromIntersectionObserver(element, options?)` | Emits an `IntersectionObserverEntry` when the element visibility changes (emits "visible" once if not supported) |
| `catchSwitchMapError(errorAction)`            | Like `catchError`, but keeps the source alive: emits `errorAction(error)` and resubscribes                       |
| `SubscriptionsBucket`                         | Collects subscriptions (optionally by key) to unsubscribe them all at once                                       |

The observers disconnect automatically when unsubscribed:

```ts
fromResizeObserver(this.elementRef.nativeElement)
  .pipe(takeUntilDestroyed())
  .subscribe((entry) => (this.width = entry.contentRect.width));
```

```ts
private subscriptions = new SubscriptionsBucket();

ngOnInit(): void {
  this.subscriptions.push(this.a$.subscribe());
  this.subscriptions.push(this.b$.subscribe(), 'b'); // Pushing another 'b' unsubscribes the previous one
}

ngOnDestroy(): void {
  this.subscriptions.unsubscribeAll();
}
```

## DOM helpers

| Helper                                 | Description                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Device.isTouch()`                     | Observable of whether the device is touch-enabled (switches to `true` on the first touch)    |
| `Device.webpSupported`                 | Observable that emits whether the browser supports WebP images                               |
| `Device.pixelRatio`                    | `window.devicePixelRatio`, rounded up                                                        |
| `Dom.focusedElement`                   | The focused element                                                                          |
| `Dom.isFocused(element)`               | Whether the element has focus                                                                |
| `Dom.blurFocusedElement()`             | Removes focus from the focused element                                                       |
| `Dom.getScrollingParent(element)`      | The closest element (including itself) whose content overflows vertically                    |
| `normalizeCommonJSImport(import(...))` | Returns the `default` export of a dynamically imported CommonJS module, or the module itself |

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
