import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CanComponentDeactivate } from '../../helpers/can-component-deactivate';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  public canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> {
    if (nextState) {
      let nextRoute: ActivatedRouteSnapshot = nextState.root;

      while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
      }

      return component.canDeactivate(currentRoute, nextRoute);
    }

    return of(true);
  }
}
