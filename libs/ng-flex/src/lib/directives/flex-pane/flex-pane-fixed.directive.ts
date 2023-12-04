import { AfterViewInit, Directive, Input, OnDestroy } from '@angular/core';

import { debounceTime } from 'rxjs/operators';

import { fromMutationObserver } from '@nicolabello/ng-helpers';

import { FlexPaneService } from '../../services/flex-pane.service';

import { FlexPaneDirective } from './flex-pane.directive';

@Directive({
  selector: '[nbFlexPaneFixed]',
  providers: [FlexPaneService],
})
export class FlexPaneFixedDirective extends FlexPaneDirective implements AfterViewInit, OnDestroy {
  @Input() public observeChanges = false;

  public ngAfterViewInit(): void {
    this.flexContainer.addFixedPane(this);

    if (this.observeChanges) {
      this.subscriptions.push(
        fromMutationObserver(this.hostElement)
          .pipe(debounceTime(100))
          .subscribe(() => this.flexContainer.forceUpdate())
      );
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.flexContainer.removeFixedPane(this);
  }
}
