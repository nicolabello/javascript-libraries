import { Directive, HostBinding } from '@angular/core';

import { Size } from '../../models/size';
import { FlexContainerService } from '../../services/flex-container.service';

import { FlexContainerDirective } from './flex-container.directive';

@Directive({
  selector: '[nbFlexContainerHorizontal]',
  providers: [FlexContainerService],
})
export class FlexContainerHorizontalDirective extends FlexContainerDirective {
  @HostBinding('style.position') public position = 'relative';

  protected updateChildren(size: Size): void {
    let fixedPanesBeforeSize = 0;
    for (const pane of this.fixedPanesBefore) {
      pane.height = size.height;
      pane.position = 'absolute';
      pane.left = fixedPanesBeforeSize;
      fixedPanesBeforeSize += pane.width;
    }

    let fixedPanesAfterSize = 0;
    for (const pane of this.fixedPanesAfter) {
      pane.height = size.height;
      pane.position = 'absolute';
      pane.right = fixedPanesAfterSize;
      fixedPanesAfterSize += pane.width;
    }

    if (this.dynamicPane) {
      this.dynamicPane.width = size.width - fixedPanesBeforeSize - fixedPanesAfterSize;
      this.dynamicPane.height = size.height;
      this.dynamicPane.position = 'absolute';
      this.dynamicPane.left = fixedPanesBeforeSize;
    }
  }
}
