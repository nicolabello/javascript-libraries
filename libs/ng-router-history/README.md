# @nicolabello/ng-router-history

[![npm](https://img.shields.io/npm/v/@nicolabello/ng-router-history.svg)](https://www.npmjs.com/package/@nicolabello/ng-router-history)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Tracks the Angular Router navigation history, so you know whether there is a previous page **inside your app** and can implement a "back" button that never takes the user out of it.

- Follows imperative navigations (`router.navigate`, `routerLink`) and browser back/forward
- Exposes the previous and current URL and whether the user can go back
- `navigateBack()` goes back in the history, or to a fallback route when the user landed directly on the page

## Compatibility

| @nicolabello/ng-router-history | Angular |
| ------------------------------ | ------- |
| 0.1.x                          | 22      |
| 0.0.x                          | 18      |

## Installation

```bash
npm install @nicolabello/ng-router-history
```

## Setup

Standalone applications:

```ts
import { provideRouter } from '@angular/router';

import { provideRouterHistory } from '@nicolabello/ng-router-history';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideRouterHistory()],
});
```

NgModule applications: import `RouterHistoryModule` once, in the root module.

```ts
@NgModule({
  imports: [RouterModule.forRoot(routes), RouterHistoryModule],
})
export class AppModule {}
```

## Usage

A back button that is only shown when there is a previous page, and a link that goes back to the list if possible, or opens it otherwise:

```ts
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { RouterHistoryService } from '@nicolabello/ng-router-history';

@Component({
  selector: 'app-toolbar',
  imports: [AsyncPipe],
  template: `
    @if (routerHistory.canNavigateBack | async) {
      <button (click)="routerHistory.navigateBack()">Back</button>
    }
    <button (click)="routerHistory.navigateBack(['/products'])">All products</button>
  `,
})
export class ToolbarComponent {
  protected routerHistory = inject(RouterHistoryService);
}
```

## API

### `RouterHistoryService`

| Member                                | Description                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `canNavigateBack`                     | `Observable<boolean>`: whether there is a previous entry in the in-app history                                     |
| `previousUrl` / `previousUrlSnapshot` | The URL of the previous entry, or `null`                                                                           |
| `currentUrl` / `currentUrlSnapshot`   | The URL of the current entry (after redirects)                                                                     |
| `activatedRoute`                      | `Observable<ActivatedRoute \| null>`: the deepest activated route after each navigation                            |
| `navigateBack(commands?, extras?)`    | Goes back in the browser history if there is a previous in-app entry, otherwise navigates to `commands` (if given) |

### `provideRouterHistory()`

Provides `RouterHistoryService` and starts tracking navigation when the application starts.

### `RouterHistoryModule`

NgModule equivalent of `provideRouterHistory()`.

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
