import { Subscription } from 'rxjs';

export class SubscriptionsBucket {
  private subscriptionsArray: Subscription[] = [];
  private subscriptionsObject: { [key: string]: Subscription } = {};

  private static safelyUnsubscribe(subscription: Subscription): void {
    try {
      subscription.unsubscribe();
    } catch (e) {}
  }

  public push(subscription: Subscription, key?: string): void {
    if (key) {
      if (this.subscriptionsObject[key]) {
        SubscriptionsBucket.safelyUnsubscribe(this.subscriptionsObject[key]);
      }
      this.subscriptionsObject[key] = subscription;
    } else {
      this.subscriptionsArray.push(subscription);
    }
  }

  public add(subscription: Subscription, key?: string): void {
    return this.push(subscription, key);
  }

  public unsubscribe(key: string): void {
    if (this.subscriptionsObject[key]) {
      SubscriptionsBucket.safelyUnsubscribe(this.subscriptionsObject[key]);
      delete this.subscriptionsObject[key];
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
