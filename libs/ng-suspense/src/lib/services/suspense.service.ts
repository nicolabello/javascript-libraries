import { Injectable, OnDestroy } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { SuspenseValue } from '../helpers/suspense-value';
import {
  SuspenseData,
  SuspenseError,
  SuspenseLoading,
} from '../types/suspense';

@Injectable()
export class SuspenseService implements OnDestroy {
  public readonly data = new SuspenseValue<SuspenseData>();
  public readonly loading = new SuspenseValue<SuspenseLoading>();
  public readonly error = new SuspenseValue<SuspenseError>();

  public get valuesChanges(): Observable<void> {
    return merge(
      this.data.valueChanges,
      this.loading.valueChanges,
      this.error.valueChanges
    );
  }

  public ngOnDestroy(): void {
    this.data.unsubscribe();
    this.loading.unsubscribe();
    this.error.unsubscribe();
  }
}
