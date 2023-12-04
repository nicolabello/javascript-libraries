import { LocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, NavigationExtras, NavigationStart, Router } from '@angular/router';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

import { RouterHistory } from '../models/router-history';

@Injectable()
export class RouterHistoryService {
  private previousUrlSubject = new BehaviorSubject<string | null>(null);
  private currentUrlSubject = new BehaviorSubject<string | null>(null);

  private activatedRouteSubject = new BehaviorSubject<ActivatedRoute | null>(null);

  public constructor(private router: Router, private location: LocationStrategy) {}

  public init(): void {
    this.historyObserver().subscribe();
    this.activatedRouteObserver().subscribe();
  }

  private historyObserver(): Observable<RouterHistory> {
    return this.router.events.pipe(
      // Only include NavigationStart and NavigationEnd events
      filter<Event, NavigationStart | NavigationEnd>(
        (event: Event): event is NavigationStart | NavigationEnd =>
          event instanceof NavigationStart || event instanceof NavigationEnd
      ),
      scan<NavigationStart | NavigationEnd, RouterHistory>(
        (acc, event): RouterHistory => {
          if (event instanceof NavigationStart) {
            // We need to track the trigger, id, and restoredId from the NavigationStart events
            return {
              ...acc,
              event,
              trigger: event.navigationTrigger,
              id: event.id,
              restoredId: event.restoredState?.navigationId || undefined,
            };
          }

          // NavigationEnd events
          const history = [...acc.history];
          let currentIndex = acc.currentIndex;

          let direction = 0;

          // Router events are imperative (router.navigate or routerLink)
          if (acc.trigger === 'imperative') {
            // Remove all events in history that come after the current index
            history.splice(currentIndex + 1);

            // Add the new event to the end of the history and set that as our current index
            history.push({ id: acc.id, url: event.urlAfterRedirects });
            currentIndex = history.length - 1;

            direction = 1;
          }

          // Browser events (back/forward) are popstate events
          else if (acc.trigger === 'popstate') {
            // Get the history item that references the restoredId
            const i = history.findIndex((item) => item.id === acc.restoredId);

            // If found, set the current index to that history item and update the id
            if (i > -1) {
              direction = i - currentIndex;
              currentIndex = i;
              history[i].id = acc.id;
            } else {
              currentIndex = 0;
            }
          }

          return {
            ...acc,
            event,
            history,
            currentIndex,
            direction,
          };
        },
        {
          event: undefined,
          history: [],
          trigger: undefined,
          id: 0,
          restoredId: 0,
          currentIndex: 0,
          direction: 0,
        }
      ),
      // Filter out so we only act when navigation is done
      filter(({ event, trigger }) => event instanceof NavigationEnd && !!trigger),
      tap(({ history, currentIndex }) => {
        const previous = history[currentIndex - 1];
        const current = history[currentIndex];

        // Update current and previous urls
        this.previousUrlSubject.next(previous?.url || null);
        this.currentUrlSubject.next(current.url);
      })
    );
  }

  private activatedRouteObserver(): Observable<ActivatedRoute> {
    return this.router.events.pipe(
      filter<Event, NavigationEnd>((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        let activatedRoute = this.router.routerState.root;
        let firstChild = activatedRoute.firstChild;

        while (firstChild) {
          activatedRoute = firstChild;
          firstChild = activatedRoute.firstChild;
        }

        return activatedRoute;
      }),
      tap((activatedRoute) => this.activatedRouteSubject.next(activatedRoute))
    );
  }

  public get canNavigateBack(): Observable<boolean> {
    return this.previousUrlSubject.asObservable().pipe(map((url) => !!url));
  }

  public navigateBack(commands?: any[], extras?: NavigationExtras): void {
    if (this.previousUrlSubject.value) {
      this.location.back();
    } else if (commands) {
      this.router.navigate(commands, extras);
    }
  }
}
