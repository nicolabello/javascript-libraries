import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {SubscriptionsBucket} from '@nicolabello/ng-helpers';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {HistoryRoute} from '../helpers/history-route';
import {ParentRoute} from '../models/parent-route';
import {HistoryLocationStrategy} from './history-location-strategy.service';

@Injectable()
export class HistoryRouterService implements OnDestroy {

  private subscriptions = new SubscriptionsBucket();
  private routeSubject = new BehaviorSubject<HistoryRoute | null>(null);

  constructor(private router: Router,
              private location: HistoryLocationStrategy) {
  }

  public get route(): Observable<HistoryRoute | null> {
    return this.routeSubject.asObservable();
  }

  public get routeSnapshot(): HistoryRoute | null {
    return this.routeSubject.value;
  }

  public initActivatedRouteObserver(activatedRoute: ActivatedRoute): void {

    this.subscriptions.unsubscribe('activatedRoute');

    this.subscriptions.push(merge(activatedRoute.url, activatedRoute.params, activatedRoute.queryParams).pipe(
      map(() => this.location.getState()),
      distinctUntilChanged((before, after) => JSON.stringify(before) === JSON.stringify(after)),
    ).subscribe(state => {
      if (state) {
        this.routeSubject.next(new HistoryRoute(activatedRoute, state));
      }
    }), 'activatedRoute');

  }

  public goBack(): void {
    if (this.routeSnapshot?.backAllowed) {
      this.location.back();
    }
  }

  public navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {

    const route: HistoryRoute | null = this.routeSnapshot;

    const parents: ParentRoute[] | null = route ? [...route.state.parents, {
      url: route.url,
      urlWithParams: route.urlWithParams,
    }] : null;

    extras = extras || {};

    extras.state = {
      ...(extras.state || {}),
      parents,
    };

    return this.router.navigate(commands, extras);

  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribeAll();
  }

}
