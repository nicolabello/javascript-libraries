# @nicolabello/ng-suspense

[![npm](https://img.shields.io/npm/v/@nicolabello/ng-suspense.svg)](https://www.npmjs.com/package/@nicolabello/ng-suspense)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Declarative **loading**, **error**, **empty** and **data** states for Angular templates.

Bind your data, loading and error state (plain values, Promises or Observables) once, then describe what to show for each state. No more `@if (loading) ... @else if (error) ... @else if (!items.length) ...` chains.

## Compatibility

| @nicolabello/ng-suspense | Angular |
| ------------------------ | ------- |
| 3.x                      | 22      |
| 2.x                      | 18      |

## Installation

```bash
npm install @nicolabello/ng-suspense
```

## Usage

Import `SuspenseModule` (or the individual standalone components and directives) in your component:

```ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { SuspenseModule } from '@nicolabello/ng-suspense';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-users',
  imports: [SuspenseModule],
  template: `
    <nb-suspense [data]="users" [loading]="loading" [error]="error">
      <ul *nbSuspenseIfData="let list; ofType: users">
        @for (user of list; track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
      <p *nbSuspenseIfEmpty>No users yet.</p>
      <p *nbSuspenseIfLoading>Loading…</p>
      <p *nbSuspenseIfError="let err; ofType: error">Something went wrong: {{ err.message }}</p>
    </nb-suspense>
  `,
})
export class UsersComponent {
  public users: User[] = [];
  public loading = true;
  public error: HttpErrorResponse | null = null;

  public constructor() {
    inject(HttpClient)
      .get<User[]>('/api/users')
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }
}
```

`[data]`, `[loading]` and `[error]` also accept Observables and Promises, which are subscribed to (and unsubscribed from) automatically:

```html
<nb-suspense [data]="users$" [loading]="loading$" [error]="error$">...</nb-suspense>
```

If you don't want an extra element in the DOM, use the `nbSuspense` attribute directive on any element or `ng-container`:

```html
<ng-container nbSuspense [data]="users" [loading]="loading" [error]="error">...</ng-container>
```

## API

### `<nb-suspense>` / `[nbSuspense]`

| Input                       | Type                               | Default | Description                                                          |
| --------------------------- | ---------------------------------- | ------- | -------------------------------------------------------------------- |
| `data`                      | `T \| Observable<T> \| Promise<T>` |         | The data                                                             |
| `loading`                   | `T \| Observable<T> \| Promise<T>` |         | Whether the data is loading                                          |
| `error`                     | `T \| Observable<T> \| Promise<T>` |         | The error, if any                                                    |
| `prioritizeDataOverLoading` | `boolean`                          | `true`  | Keep showing the data (instead of the loading state) while reloading |
| `prioritizeDataOverError`   | `boolean`                          | `true`  | Keep showing the data (instead of the error) if a reload fails       |

Each value is considered "present" when it is truthy, with two exceptions: `0` is present, and empty arrays and empty plain objects (`[]`, `{}`) are not.

### Structural directives

| Directive              | Shown when                             | Template variable (`let x`) |
| ---------------------- | -------------------------------------- | --------------------------- |
| `*nbSuspenseIfData`    | there is data                          | the data                    |
| `*nbSuspenseIfEmpty`   | there is no data, no loading, no error | the data                    |
| `*nbSuspenseIfLoading` | loading                                | the loading value           |
| `*nbSuspenseIfError`   | there is an error and not loading      | the error                   |

Use `ofType` to give the template variable a type, e.g. `*nbSuspenseIfData="let user ofType user"`. With `*nbSuspenseIfData` and `*nbSuspenseIfError` the variable is non-nullable.

### Which state is shown

With the default settings (data has priority over loading and error):

| Data | Loading | Error | Shown   |
| :--: | :-----: | :---: | ------- |
|  ✓   |         |       | data    |
|  ✓   |    ✓    |       | data    |
|  ✓   |         |   ✓   | data    |
|      |    ✓    |       | loading |
|      |    ✓    |   ✓   | loading |
|      |         |   ✓   | error   |
|      |         |       | empty   |

With `[prioritizeDataOverLoading]="false"`, loading replaces the data while it is loading. With `[prioritizeDataOverError]="false"`, an error replaces the data.

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
