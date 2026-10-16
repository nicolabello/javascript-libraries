# @nicolabello/ng-flex

[![npm](https://img.shields.io/npm/v/@nicolabello/ng-flex.svg)](https://www.npmjs.com/package/@nicolabello/ng-flex)
[![License: GPL v2+](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)

Angular directives for full-screen application layouts made of **fixed** panes (sized by their content, e.g. a header or a side menu) and one **dynamic** pane that takes exactly the remaining space, in pixels.

Sizes are recalculated when the window or a parent pane is resized, so nested layouts (e.g. a header + a body split into menu and content) always fit the viewport, and each dynamic pane can scroll on its own.

## Compatibility

| @nicolabello/ng-flex | Angular |
| -------------------- | ------- |
| 3.x                  | 22      |
| 2.x                  | 18      |

## Installation

```bash
npm install @nicolabello/ng-flex
```

## Usage

Import `FlexModule` (or the individual standalone components and directives):

```ts
import { Component } from '@angular/core';

import { FlexModule } from '@nicolabello/ng-flex';

@Component({
  selector: 'app-root',
  imports: [FlexModule],
  template: `
    <nb-flex-root>
      <div nbFlexContainerVertical>
        <header nbFlexPaneFixed>Header</header>

        <div nbFlexPaneDynamic>
          <div nbFlexContainerHorizontal>
            <nav nbFlexPaneFixed style="width: 240px">Menu</nav>
            <main nbFlexPaneDynamic style="overflow: auto">Content</main>
          </div>
        </div>

        <footer nbFlexPaneFixed>Footer</footer>
      </div>
    </nb-flex-root>
  `,
})
export class AppComponent {}
```

```
┌──────────────────────────────┐
│ Header                       │
├──────────┬───────────────────┤
│ Menu     │ Content           │
│ (240px)  │ (remaining space, │
│          │  scrollable)      │
├──────────┴───────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## API

| Selector                      | Description                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `<nb-flex-root>`              | Fills its closest positioned ancestor (`position: absolute; inset: 0`), e.g. the whole page. Every layout must be inside one.  |
| `[nbFlexContainerVertical]`   | Stacks its panes vertically. Fixed panes take their content height, the dynamic pane takes the remaining height.               |
| `[nbFlexContainerHorizontal]` | Places its panes side by side. Fixed panes take their own width (set it with CSS), the dynamic pane takes the remaining width. |
| `[nbFlexPaneFixed]`           | A pane sized by its content. Fixed panes declared before the dynamic pane are placed before it, the others after it.           |
| `[nbFlexPaneDynamic]`         | The pane that takes the remaining space. One per container.                                                                    |

A container placed inside a pane fills that pane. A container that is not inside a pane fills `<nb-flex-root>`.

| Input                                   | Description                                                                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `[observeChanges]` on `nbFlexPaneFixed` | Recalculates the layout when the content of the pane changes (e.g. a header that grows), using a `MutationObserver`. |
| `[fromRootContainer]` on containers     | Sizes the container from `<nb-flex-root>` even when it is inside a pane.                                             |

## License

[GPL-2.0-or-later](https://github.com/nicolabello/javascript-libraries/blob/master/LICENSE)
