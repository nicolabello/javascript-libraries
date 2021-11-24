import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { FlexPaneService } from '../../services/flex-pane.service';
import { FlexPaneDirective } from './flex-pane.directive';

@Directive({
  selector: '[nbFlexPaneDynamic]',
  providers: [FlexPaneService],
})
export class FlexPaneDynamicDirective
  extends FlexPaneDirective
  implements AfterViewInit, OnDestroy
{
  public ngAfterViewInit(): void {
    this.flexContainer.setDynamicPane(this);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.flexContainer.unsetDynamicPane(this);
  }
}
