import {
  LocationChangeEvent,
  PathLocationStrategy,
  PlatformLocation,
} from '@angular/common';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { HistoryState } from '../models/history-state';
import { NavigationDirection } from '../models/navigation-direction';
import { ParentRoute } from '../models/parent-route';

export interface StateData extends Params {
  parents?: ParentRoute[];
  direction?: NavigationDirection;
}

/*
Possible calls:
- on navigation: pushState
- on navigation with replace option: replaceState
- on back or forward: popState + replaceState
*/

@Injectable()
export class HistoryLocationStrategy extends PathLocationStrategy {
  private state: HistoryState | null = null;

  constructor(platformLocation: PlatformLocation) {
    super(platformLocation);
    super.onPopState(this.popState.bind(this));
  }

  public getState(): HistoryState | null {
    return this.state ? { ...this.state } : null;
  }

  public pushState(
    state: StateData,
    title: string,
    url: string,
    queryParams: string
  ): void {
    // console.group('pushState');
    // console.log(state, title, url, queryParams);

    this.state = this.getHistoryState(state, url);
    super.pushState(this.state, title, url, queryParams);

    // console.log('Pushed', {...state});
    // console.groupEnd();
  }

  public replaceState(
    state: StateData,
    title: string,
    url: string,
    queryParams: string
  ): void {
    // console.group('replaceState');
    // console.log(state, title, url, queryParams);

    if (this.state) {
      // If url === this.state.url the replaceState has been called straight after a popState
      if (url !== this.state.url) {
        this.state.url = url;
        this.state.direction = null;
        this.state.replaced = true;
      }

      // console.log('Replaced current', {...this.state});
    } else {
      this.state = this.getHistoryState(state, url);

      // console.log('Replaced with new', {...this.state});
    }

    super.replaceState(this.state, title, url, queryParams);

    // console.groupEnd();
  }

  private getHistoryState(state: StateData, url: string): HistoryState {
    return {
      url,
      timestamp: Date.now(),
      parents: state.parents || [],
      direction: state.direction || NavigationDirection.Forward,
      replaced: false,
    };
  }

  private getNewDirection(state: HistoryState): NavigationDirection | null {
    const stateTimestamp = this.state?.timestamp || 0;

    if (state.timestamp < stateTimestamp) {
      return NavigationDirection.Backward;
    }

    if (state.timestamp > stateTimestamp) {
      return NavigationDirection.Forward;
    }

    // This should never happen
    return null;
  }

  private popState(event: LocationChangeEvent): void {
    // console.group('popState');
    // console.log(event.state);

    // First state when app loads is undefined
    if (event.state) {
      this.state = {
        ...event.state,
        direction: this.getNewDirection(event.state),
        replaced: false,
      };
    }

    // console.log('Popped', {...this.state});
    // console.groupEnd();
  }
}
