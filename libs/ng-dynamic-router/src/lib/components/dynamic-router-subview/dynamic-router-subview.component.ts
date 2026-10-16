import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';

import { SubscriptionsBucket } from '@nicolabello/ng-helpers';

import { Subview } from '../../models/subview';
import { DynamicRouterService } from '../../services/dynamic-router.service';

@Component({
  selector: 'nb-dynamic-router-subview',
  templateUrl: './dynamic-router-subview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynamicRouterService],
})
export class DynamicRouterSubviewComponent implements OnInit, OnDestroy {
  private parentRouterService = inject(DynamicRouterService, { skipSelf: true });
  private cdr = inject(ChangeDetectorRef);
  private routerService = inject(DynamicRouterService);

  public active: Subview;
  @Input() public level = 0;
  private subscriptions = new SubscriptionsBucket();

  public ngOnInit(): void {
    this.routerService.level =
      this.level >= this.parentRouterService.subviewLevel ? this.level : this.parentRouterService.subviewLevel;
    this.subscriptions.push(
      this.routerService.currentSubview.subscribe((subview) => {
        this.active = subview;
        this.cdr.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribeAll();
  }
}
