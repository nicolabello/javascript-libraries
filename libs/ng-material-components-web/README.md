# @nicolabello/ng-material-components-web

[![npm](https://img.shields.io/npm/v/@nicolabello/ng-material-components-web.svg)](https://www.npmjs.com/package/@nicolabello/ng-material-components-web)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Angular directives that automatically initialise [Material Components for the Web](https://github.com/material-components/material-components-web) (MDC Web) components, and keep text fields, selects and switches in sync with Angular forms.

Write the standard MDC Web markup: the directives match the MDC CSS classes, create the MDC component instance after the view is rendered and destroy it with the element.

> MDC Web is in maintenance mode. For new projects consider [Angular Material](https://material.angular.dev).

## Compatibility

| @nicolabello/ng-material-components-web | Angular | MDC Web |
| --------------------------------------- | ------- | ------- |
| 3.x                                     | 22      | 14      |
| 2.x                                     | 18      | 14      |

## Installation

```bash
npm install @nicolabello/ng-material-components-web material-components-web
```

Include the MDC Web styles in your application, e.g. in `angular.json`:

```json
"styles": ["node_modules/material-components-web/dist/material-components-web.min.css", "src/styles.scss"]
```

or, with Sass, `@use 'material-components-web/material-components-web';` (see the [MDC Web documentation](https://github.com/material-components/material-components-web/blob/master/docs/getting-started.md) for theming).

## Usage

Import `MaterialComponentsWebModule` (or the individual standalone directives):

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MaterialComponentsWebModule } from '@nicolabello/ng-material-components-web';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, MaterialComponentsWebModule],
  template: `
    <label class="mdc-text-field mdc-text-field--filled" [mdcFormControl]="name">
      <span class="mdc-text-field__ripple"></span>
      <span class="mdc-floating-label">Name</span>
      <input class="mdc-text-field__input" type="text" [formControl]="name" />
      <span class="mdc-line-ripple"></span>
    </label>

    <button class="mdc-button mdc-button--raised" (click)="save()">
      <span class="mdc-button__label">Save</span>
    </button>
  `,
})
export class ProfileComponent {
  public name = new FormControl('', Validators.required);

  public save(): void {
    // ...
  }
}
```

The text field above gets the MDC behaviours (floating label, ripple) and reflects the form control: its value, `disabled` state and validity (shown as invalid once the control is dirty or touched).

## Directives

| Directive                      | Matches                                                                                 | Inputs / outputs                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `TextFieldDirective`           | `.mdc-text-field`                                                                       | `mdcFormControl`, or `value`, `required`, `disabled`, `invalid`                  |
| `TextFieldHelperTextDirective` | `.mdc-text-field-helper-text`                                                           |                                                                                  |
| `SelectDirective`              | `.mdc-select`                                                                           | `mdcFormControl`, or `value`, `required`, `disabled`, `invalid`; `(valueChange)` |
| `SelectHelperTextDirective`    | `.mdc-select-helper-text`                                                               |                                                                                  |
| `SwitchDirective`              | `.mdc-switch`                                                                           | `mdcFormControl`, or `selected`, `disabled`                                      |
| `ListDirective`                | `.mdc-list`                                                                             |                                                                                  |
| `MenuDirective`                | `.mdc-menu`                                                                             | `anchorElement`; `toggle(open?)` method                                          |
| `TabBarDirective`              | `.mdc-tab-bar`                                                                          |                                                                                  |
| `TopAppBarDirective`           | `.mdc-top-app-bar`                                                                      |                                                                                  |
| `LinearProgressDirective`      | `.mdc-linear-progress`                                                                  |                                                                                  |
| `CircularProgressDirective`    | `.mdc-circular-progress`                                                                |                                                                                  |
| `RippleDirective`              | `[mdcRipple]`, `.mdc-button`, `.mdc-fab`, `.mdc-list-item`, `.mdc-card__primary-action` | `unbounded`                                                                      |
| `RippleUnboundedDirective`     | `.mdc-icon-button`                                                                      |                                                                                  |

- Add the `mdc-no-auto-init` attribute to an element to skip the automatic initialisation (not available for ripples).
- Each directive exposes the MDC instance as `instance`, and can be referenced in templates with its `exportAs` name: `mdcTextField`, `mdcSelect`, `mdcSwitch`, `mdcList`, `mdcMenu`, `mdcTabBar`, `mdcTopAppBar`, `mdcLinearProgress`, `mdcCircularProgress`, `mdcTextFieldHelperText`, `mdcSelectHelperText`, `mdcRipple`.

For example, a menu opened by a button:

```html
<div class="mdc-menu-surface--anchor">
  <button class="mdc-button" (click)="menu.toggle()">
    <span class="mdc-button__label">Options</span>
  </button>
  <div class="mdc-menu mdc-menu-surface" #menu="mdcMenu">
    <ul class="mdc-list" role="menu">
      <li class="mdc-list-item" role="menuitem"><span class="mdc-list-item__text">Edit</span></li>
      <li class="mdc-list-item" role="menuitem"><span class="mdc-list-item__text">Delete</span></li>
    </ul>
  </div>
</div>
```

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
