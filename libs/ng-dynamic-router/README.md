# @nicolabello/ng-dynamic-router

[![npm](https://img.shields.io/npm/v/@nicolabello/ng-dynamic-router.svg)](https://www.npmjs.com/package/@nicolabello/ng-dynamic-router)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Mobile-style stacked navigation for the Angular Router:

- Pages **slide in** from the right when navigating forward and from the left when going back (including the browser back button)
- Every page knows its **parent** page, so a "back" button is only shown when it makes sense and never leaves the app
- **Subviews** (e.g. a details panel or a dialog) are stored in the URL query string, so they survive reloads and are closed with the back button
- Per-page and per-subview **query params**, encoded in the URL
- `canDeactivate` support for pages and subviews (e.g. "discard changes?")

## Compatibility

| @nicolabello/ng-dynamic-router | Angular |
| ------------------------------ | ------- |
| 3.x                            | 22      |
| 2.x                            | 18      |

The transitions use `@angular/animations`, so the application must provide animations (e.g. `provideAnimationsAsync()`).

## Installation

```bash
npm install @nicolabello/ng-dynamic-router
```

## Setup

1. Wrap the routes that should be animated with `dynamicRoute()`:

```ts
import { Routes } from '@angular/router';

import { dynamicRoute } from '@nicolabello/ng-dynamic-router';

export const routes: Routes = [
  dynamicRoute({ path: 'products', component: ProductListComponent }),
  dynamicRoute({ path: 'products/:id', component: ProductComponent }),
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
```

2. Provide the router and the dynamic router (`forRoot()` replaces the `LocationStrategy` to track the navigation direction):

```ts
import { importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { DynamicRouterModule } from '@nicolabello/ng-dynamic-router';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(DynamicRouterModule.forRoot())],
});
```

In NgModule applications, import `DynamicRouterModule.forRoot()` in the root module and `DynamicRouterModule.forChild()` in feature modules.

3. Use `<nb-dynamic-router-outlet>` instead of `<router-outlet>`:

```ts
import { DynamicRouterOutletComponent } from '@nicolabello/ng-dynamic-router';

@Component({
  selector: 'app-root',
  imports: [DynamicRouterOutletComponent],
  template: `<nb-dynamic-router-outlet />`,
})
export class AppComponent {}
```

## Navigation

Use the `nbDynamicRouterLink` directive or `DynamicRouterService`. Navigating with them records the current page as the parent of the new one.

```ts
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { DynamicRouterLinkDirective, DynamicRouterService } from '@nicolabello/ng-dynamic-router';

@Component({
  selector: 'app-product',
  imports: [AsyncPipe, DynamicRouterLinkDirective],
  template: `
    @if (router.backAllowed | async) {
      <button (click)="router.goBack()">Back</button>
    }
    <a [nbDynamicRouterLink]="['/products', 2]">Next product</a>
  `,
})
export class ProductComponent {
  protected router = inject(DynamicRouterService);
}
```

| `DynamicRouterService` member                                          | Description                                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `navigate(commands, extras?)`                                          | Navigates forward (same arguments as `Router.navigate`)                         |
| `goBack()`                                                             | Goes back to the parent page, if there is one                                   |
| `backAllowed`                                                          | `Observable<boolean>`: whether the current page has a parent                    |
| `animating`                                                            | `Observable<boolean>`: whether a transition is running                          |
| `navigationDirection`                                                  | Direction of the last navigation (`NavigationDirection.Forward` / `Backward`)   |
| `isActive(url)`                                                        | `Observable<boolean>`: whether `url` is the current page                        |
| `globalParams` / `globalQueryParams`                                   | Route params and query params of the current page (plus `...Snapshot` versions) |
| `queryParams` / `setQueryParam(key, value)` / `setQueryParams(params)` | Query params scoped to the current page or subview, encoded in the URL          |

The `nbDynamicRouterLinkActive` pipe tells whether a link is active, e.g. `[class.active]="['/products'] | nbDynamicRouterLinkActive | async"`.

## Subviews

A subview is a named view (for example a details panel) whose state is kept in the query string (`?s1=details&q1=...`), so it can be opened, closed with the back button and restored on reload.

```html
<nb-dynamic-router-subview #subview>
  @if (subview.active === 'filters') {
  <app-filters />
  }
</nb-dynamic-router-subview>
```

```ts
// Open the "filters" subview of the first level, with some params
this.router.showSubview(1, 'filters', { category: 'books' });

// Close it (goes back in the history)
this.router.hideSubview(1);

// React when it is closed
this.router.subviewHidden(1).subscribe((subview) => console.log(`${subview} closed`));
```

Components inside `<nb-dynamic-router-subview>` get a `DynamicRouterService` scoped to the subview level: their `queryParams` and `setQueryParam()` read and write the params of that subview. Subviews can be nested.

## Preventing navigation

Implement `CanComponentDeactivate` and register the component as the active one for its level:

```ts
import { Observable, of } from 'rxjs';

import { CanComponentDeactivate, DynamicRouterService } from '@nicolabello/ng-dynamic-router';

export class EditProductComponent implements CanComponentDeactivate {
  private router = inject(DynamicRouterService);

  public constructor() {
    this.router.setActiveComponent(this);
  }

  public canDeactivate(): Observable<boolean> {
    return of(!this.form.dirty || confirm('Discard changes?'));
  }
}
```

`canDeactivate()` is called when leaving the page, or when closing the subview the component is in.

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
