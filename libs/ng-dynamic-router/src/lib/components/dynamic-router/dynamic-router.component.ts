import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { CanComponentDeactivate } from '../../helpers/can-component-deactivate';
import { DynamicRouterService } from '../../services/dynamic-router.service';
import { HistoryRouterService } from '../../services/history-router.service';

@Component({
  template: '',
})
export class DynamicRouterComponent implements CanComponentDeactivate {
  public constructor(
    private historyRouterService: HistoryRouterService,
    private routerService: DynamicRouterService,
    activatedRoute: ActivatedRoute
  ) {
    historyRouterService.initActivatedRouteObserver(activatedRoute);
  }

  public canDeactivate(currentRoute: ActivatedRouteSnapshot, nextRoute: ActivatedRouteSnapshot): Observable<boolean> {
    const deactivatingComponent = this.routerService.getDeactivatingComponent(currentRoute, nextRoute);
    return deactivatingComponent?.canDeactivate
      ? deactivatingComponent.canDeactivate(currentRoute, nextRoute)
      : of(true);
  }
}
