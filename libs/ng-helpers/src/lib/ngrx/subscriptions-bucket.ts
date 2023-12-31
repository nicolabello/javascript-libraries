import { Observable, Subscription } from 'rxjs';

export class SubscriptionsBucket {
  private subscriptionsArray: Subscription[] = [];
  private subscriptionsObject: { [key: string]: Subscription } = {};

  private static safelyUnsubscribe(subscription: Subscription): void {
    try {
      subscription.unsubscribe();
    } catch (e) {
      return;
    }
  }

  private static getSubscription(subscriptionOrObservable: Subscription | Observable<unknown>): Subscription {
    return subscriptionOrObservable instanceof Subscription
      ? subscriptionOrObservable
      : subscriptionOrObservable.subscribe();
  }

  public push(subscriptionOrObservable: Subscription | Observable<unknown>, key?: string): void {
    if (key) {
      if (this.subscriptionsObject[key]) {
        SubscriptionsBucket.safelyUnsubscribe(this.subscriptionsObject[key]);
      }
      this.subscriptionsObject[key] = SubscriptionsBucket.getSubscription(subscriptionOrObservable);
    } else {
      this.subscriptionsArray.push(SubscriptionsBucket.getSubscription(subscriptionOrObservable));
    }
  }

  public add(subscriptionOrObservable: Subscription | Observable<unknown>, key?: string): void {
    return this.push(subscriptionOrObservable, key);
  }

  public unsubscribe(key?: string): void {
    if (key) {
      if (this.subscriptionsObject[key]) {
        SubscriptionsBucket.safelyUnsubscribe(this.subscriptionsObject[key]);
        delete this.subscriptionsObject[key];
      }
    } else {
      this.unsubscribeAll();
    }
  }

  public unsubscribeAll(): void {
    this.subscriptionsArray.forEach((subscription) => SubscriptionsBucket.safelyUnsubscribe(subscription));
    this.subscriptionsArray = [];

    for (const key of Object.keys(this.subscriptionsObject)) {
      SubscriptionsBucket.safelyUnsubscribe(this.subscriptionsObject[key]);
      delete this.subscriptionsObject[key];
    }
  }
}
