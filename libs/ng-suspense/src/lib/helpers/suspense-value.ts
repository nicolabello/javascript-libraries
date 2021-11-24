import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { SuspenseInput } from '../models/suspense';

function isPromise(value: any): value is Promise<any> {
  return typeof value?.then === 'function';
}

function isArray(value: any): value is [] {
  return Array.isArray(value);
}

function isObject(value: any): value is object {
  return value && typeof value === 'object' && value.constructor === Object;
}

export class SuspenseValue<T = any> {
  public value?: T;
  public booleanValue = false;

  private source?: SuspenseInput<T>;
  private valueSubscription?: Subscription;
  private changeSubject = new Subject<void>();

  public get valueChanges(): Observable<void> {
    return this.changeSubject.asObservable();
  }

  public async init(source: SuspenseInput<T>): Promise<any> {
    if (source !== this.source) {
      this.unsubscribe();
      this.source = source;

      if (isObservable(source)) {
        this.valueSubscription = source.subscribe((value: T) => {
          this.value = value;
          this.booleanValue = this.toBoolean(this.value);
          this.changeSubject.next();
        });
        return;
      }

      if (isPromise(source)) {
        this.value = await source;
        this.booleanValue = this.toBoolean(this.value);
        this.changeSubject.next();
        return;
      }

      this.value = source as T;
      this.booleanValue = this.toBoolean(this.value);
      this.changeSubject.next();
    }
  }

  public unsubscribe(): void {
    this.valueSubscription?.unsubscribe();
  }

  private toBoolean(value: T): boolean {
    if (isArray(value)) {
      return !!value.length;
    }

    if (isObject(value)) {
      return !!Object.keys(value).length;
    }

    return (value as any) === 0 || !!value;
  }
}
