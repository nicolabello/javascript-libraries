import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, Params } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, startWith, switchMap } from 'rxjs/operators';

import { Base64, Typings } from '@nicolabello/js-helpers';

import { CanComponentDeactivate } from '../helpers/can-component-deactivate';
import { HistoryRoute } from '../helpers/history-route';
import { NavigationDirection } from '../models/navigation-direction';
import { Subview, SubviewWithParams } from '../models/subview';

import { HistoryRouterService } from './history-router.service';

declare type GlobalParams = {
  [key: string]: string | null;
};

@Injectable()
export class DynamicRouterService implements OnDestroy {
  private static activeComponents: { [level: number]: CanComponentDeactivate } = {};

  // private readonly subviews: Subview[] = Object.keys(Subview).map(key => Subview[key]);
  public readonly animatingSubject = new BehaviorSubject<boolean>(false);
  public level = 0;

  public constructor(private historyRouterService: HistoryRouterService) {}

  public get subviewLevel(): number {
    return this.level + 1;
  }

  public get animating(): Observable<boolean> {
    return this.animatingSubject.asObservable().pipe(distinctUntilChanged());
  }

  public get route(): Observable<HistoryRoute> {
    return this.historyRouterService.route.pipe(filter((route: HistoryRoute | null): route is HistoryRoute => !!route));
  }

  public get routeSnapshot(): HistoryRoute | null {
    return this.historyRouterService.routeSnapshot;
  }

  public get activatedRoute(): Observable<ActivatedRoute> {
    return this.route.pipe(map((route: HistoryRoute) => route.activatedRoute));
  }

  public get activatedRouteSnapshot(): ActivatedRouteSnapshot | null {
    return this.routeSnapshot?.activatedRoute?.snapshot || null;
  }

  public get navigationDirection(): NavigationDirection | null {
    return this.routeSnapshot?.direction || null;
  }

  public get url(): string | null {
    return this.routeSnapshot?.url || null;
  }

  public get backAllowed(): Observable<boolean> {
    return this.route.pipe(
      map((route) => route?.backAllowed || false),
      startWith(false)
    );
  }

  /*
   * Get global params
   */

  public get globalParams(): Observable<GlobalParams> {
    return this.activatedRoute.pipe(switchMap((activatedRoute) => activatedRoute.params));
  }

  public get globalParamsSnapshot(): GlobalParams {
    return this.routeSnapshot?.params || {};
  }

  /*
   * Get params
   */

  public get params(): Observable<Params> {
    return of({});
  }

  public get paramsSnapshot(): Params {
    return {};
  }

  /*
   * Get global query params
   */

  public get globalQueryParams(): Observable<GlobalParams> {
    return this.activatedRoute.pipe(switchMap((activatedRoute) => activatedRoute.queryParams));
  }

  public get globalQueryParamsSnapshot(): Params {
    return this.activatedRouteSnapshot?.queryParams || {};
  }

  /*
   * Get query params
   */

  public get queryParams(): Observable<Params> {
    const paramsKey = this.getSubviewParamsKey(this.level);
    return this.activatedRoute.pipe(
      switchMap((activatedRoute) => activatedRoute.queryParams),
      map((queryParams) => queryParams[paramsKey] || null),
      distinctUntilChanged(),
      map((encodedParams) => (encodedParams && Base64.decode(encodedParams)) || {})
    );
  }

  public get queryParamsSnapshot(): Params {
    const paramsKey = this.getSubviewParamsKey(this.level);
    const encodedParams = this.activatedRouteSnapshot?.queryParams[paramsKey];
    return (encodedParams && Base64.decode(encodedParams)) || {};
  }

  /*
   * Get current subview
   */

  public get currentSubview(): Observable<Subview> {
    if (this.level) {
      const subviewKey = this.getSubviewKey(this.level);
      return this.activatedRoute.pipe(
        switchMap((activatedRoute) => activatedRoute.queryParams),
        map((queryParams) => queryParams[subviewKey] || null),
        distinctUntilChanged()
      );
    }
    return of(null);
  }

  public get currentSubviewSnapshot(): Subview {
    if (this.level) {
      const subviewKey = this.getSubviewKey(this.level);
      return this.activatedRouteSnapshot?.queryParams[subviewKey] || null;
    }
    return null;
  }

  public navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.historyRouterService.navigate(commands, extras);
  }

  public isActive(url: string): Observable<boolean> {
    return this.route.pipe(
      map((route) => route.url === url),
      distinctUntilChanged()
    );
  }

  public goBack(): void {
    this.historyRouterService.goBack();
  }

  /*
   * Set global query params
   */

  public setGlobalQueryParam(key: string, value: string | null = null, replace = true): Promise<boolean> {
    const previousValue = this.globalQueryParamsSnapshot[key];
    if (value !== (Typings.isDefined(previousValue) ? previousValue : null)) {
      return this.setGlobalQueryParams({ [key]: value }, replace, true);
    }
    return new Promise<boolean>((resolve) => resolve(true));
  }

  public setGlobalQueryParams(params: GlobalParams, replace = true, merge = false): Promise<boolean> {
    return this.navigate([this.url], {
      queryParams: params,
      replaceUrl: replace,
      queryParamsHandling: merge ? 'merge' : null,
    });
  }

  /*
   * Set query params
   */

  public setQueryParam(key: string, value: any = null, replace = true): Promise<boolean> {
    const previousValue = this.queryParamsSnapshot[key];
    if (value !== (Typings.isDefined(previousValue) ? previousValue : null)) {
      return this.setQueryParams({ [key]: value }, replace, true);
    }
    return new Promise<boolean>((resolve) => resolve(true));
  }

  public setQueryParams(params: Params, replace = true, merge = false): Promise<boolean> {
    const paramsKey = this.getSubviewParamsKey(this.level);
    params = merge ? { ...this.queryParamsSnapshot, ...(params || {}) } : { ...(params || {}) };

    Object.keys(params).forEach((key) => {
      if (!Typings.isDefined(params[key]) || params[key] === null) {
        delete params[key];
      }
    });

    params = {
      [paramsKey]: Object.keys(params).length ? Base64.encode(params) : null,
    };

    return this.navigate([this.url], {
      queryParams: params,
      replaceUrl: replace,
      queryParamsHandling: 'merge',
    });
  }

  /*
   * Next level subview
   */

  public showSubview(level: number, subview: Subview, params?: Params, replace?: boolean): Promise<boolean> {
    level = level || this.subviewLevel;

    const subviewKey = this.getSubviewKey(level);
    const paramsKey = this.getSubviewParamsKey(level);

    const queryParams = this.activatedRouteSnapshot?.queryParams;

    const activeSubview = (queryParams && queryParams[subviewKey]) || null;
    const activeParams = (queryParams && queryParams[paramsKey]) || null;

    const encodedParams = params ? Base64.encode(params) : null;

    if (subview !== activeSubview || encodedParams !== activeParams) {
      return this.navigate([this.url], {
        queryParams: { [subviewKey]: subview, [paramsKey]: encodedParams },
        replaceUrl: replace === true || replace === false ? replace : !subview || !!activeSubview,
        queryParamsHandling: 'merge',
      });
    }

    return new Promise<boolean>((resolve) => resolve(true));
  }

  public hideSubview(level?: number, subview?: Subview): void {
    const activeSubview = this.getSubviewSnapshot(level);
    if (activeSubview && (!subview || subview === activeSubview)) {
      this.goBack();
    }
  }

  public subviewHidden(level?: number): Observable<Subview> {
    level = level || this.subviewLevel;

    const subviewKey = this.getSubviewKey(level);

    return this.activatedRoute.pipe(
      switchMap((activatedRoute) => activatedRoute.queryParams),
      map((queryParams) => queryParams[subviewKey] || null),
      distinctUntilChanged(),
      pairwise(),
      filter(([previousSubview, currentSubview]) => previousSubview && !currentSubview),
      map(([previousSubview]) => previousSubview)
    );
  }

  public getSubviewWithParamsSnapshot<T = Subview, U = Params>(level?: number): SubviewWithParams<T, U> {
    level = level || this.subviewLevel;

    const subviewKey = this.getSubviewKey(level);
    const paramsKey = this.getSubviewParamsKey(level);

    const queryParams = this.activatedRouteSnapshot?.queryParams;

    const subview = queryParams && queryParams[subviewKey];
    const encodedParams = queryParams && queryParams[paramsKey];

    return {
      subview,
      params: encodedParams ? (Base64.decode(encodedParams) as U) : null,
    };
  }

  public getSubviewSnapshot<T = Subview>(level?: number): T {
    level = level || this.subviewLevel;

    const subviewKey = this.getSubviewKey(level);
    const queryParams = this.activatedRouteSnapshot?.queryParams;

    return queryParams && queryParams[subviewKey];
  }

  /*
   * Active component
   */
  public setActiveComponent(component: CanComponentDeactivate): void {
    DynamicRouterService.activeComponents[this.level] = component;
  }

  public getDeactivatingComponent(
    currentRoute: ActivatedRouteSnapshot,
    nextRoute: ActivatedRouteSnapshot
  ): CanComponentDeactivate | null {
    let deactivatingLevel: number | null = null;

    if (currentRoute.url.join() !== nextRoute.url.join()) {
      deactivatingLevel = 0;
    } else {
      const nextRouteKeys = Object.keys(nextRoute.queryParams);
      const closedSubviews = Object.keys(currentRoute.queryParams)
        .filter((key) => key.match(/s[1-9]+/))
        .filter((key) => !nextRouteKeys.includes(key));
      if (closedSubviews.length) {
        deactivatingLevel = closedSubviews.map((key) => parseInt(key.replace('s', ''), 10)).sort()[0];
      }
    }

    return deactivatingLevel !== null ? DynamicRouterService.activeComponents[deactivatingLevel] : null;
  }

  public ngOnDestroy(): void {
    delete DynamicRouterService.activeComponents[this.level];
  }

  private getSubviewKey(level: number): string {
    return `s${level || ''}`;
  }

  private getSubviewParamsKey(level: number): string {
    return `q${level || ''}`;
  }
}
