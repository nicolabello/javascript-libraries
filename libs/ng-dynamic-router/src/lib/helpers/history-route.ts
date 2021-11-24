import {Type} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {HistoryState} from '../models/history-state';
import {NavigationDirection} from '../models/navigation-direction';
import {ParentRoute} from '../models/parent-route';

export class HistoryRoute {

  public readonly component: Type<any>;
  public readonly params: Params;
  public readonly url: string;

  constructor(public readonly activatedRoute: ActivatedRoute, public readonly state: HistoryState) {
    // Save the following here as activatedRoute.snapshot is changing later
    this.component = activatedRoute.snapshot.data.component;
    this.params = activatedRoute.snapshot.params;
    this.url = `/${this.activatedRoute.snapshot.url.join('/')}`;
  }

  public get urlWithParams(): string {
    return this.state.url;
  }

  public get replaced(): boolean {
    return this.state.replaced;
  }

  public get direction(): NavigationDirection | null {
    if (this.state.direction === NavigationDirection.Forward && !this.parentRoute) {
      return null;
    }
    return this.state.direction || null;
  }

  public get backAllowed(): boolean {
    return !!this.parentRoute;
  }

  private get parentRoute(): ParentRoute | null {
    return this.state.parents.length ? this.state.parents[this.state.parents.length - 1] : null;
  }

}
