import { Injectable, OnDestroy } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { SuspenseValue } from '../helpers/suspense-value';
import {
  SuspenseData,
  SuspenseError,
  SuspenseLoading,
} from '../models/suspense';
import { Config } from '../models/config';
import { Visibility } from '../models/visibility';

@Injectable()
export class SuspenseService implements OnDestroy {
  public readonly data = new SuspenseValue<SuspenseData>();
  public readonly loading = new SuspenseValue<SuspenseLoading>();
  public readonly error = new SuspenseValue<SuspenseError>();

  private readonly config: Config = {
    prioritizeDataOverLoading: true,
    prioritizeDataOverError: true,
  };
  private readonly configChangeSubject = new Subject<void>();

  public get valuesChanges(): Observable<void> {
    return merge(
      this.data.valueChanges,
      this.loading.valueChanges,
      this.error.valueChanges,
      this.configChangeSubject.asObservable()
    );
  }

  public setConfig(key: keyof Config, value: boolean) {
    if (this.config[key] !== value) {
      this.config[key] = value;
      this.configChangeSubject.next();
    }
  }

  public ngOnDestroy(): void {
    this.data.unsubscribe();
    this.loading.unsubscribe();
    this.error.unsubscribe();
  }

  public get visibility(): Visibility {
    const data = this.data.booleanValue;
    const loading = this.loading.booleanValue;
    const error = this.data.booleanValue;
    const prioritizeDataOverLoading = this.config.prioritizeDataOverLoading;
    const prioritizeDataOverError = this.config.prioritizeDataOverError;

    /*return {
      data: !loading && !error && data,
      empty: !loading && !error && !data,
      loading: loading,
      error: !loading && error,
    }*/

    return {
      data:
        data &&
        (!loading || prioritizeDataOverLoading) &&
        (!error || prioritizeDataOverError),
      empty: !data && !loading && !error,
      loading: loading && !(data && prioritizeDataOverLoading),
      error: !loading && error && !(data && prioritizeDataOverError),
    };
  }
}
