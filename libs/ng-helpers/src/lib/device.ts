import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

export class Device {
  private static _isTouch: BehaviorSubject<boolean>;
  private static _webpSupported: boolean | null = null;

  // https://developers.google.com/speed/webp/faq#in_your_own_javascript
  public static get webpSupported(): Observable<boolean> {
    if (this._webpSupported !== null) {
      return of(this._webpSupported);
    }

    return new Observable((observer) => {
      const webpImage = new Image();
      webpImage.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      webpImage.onload = webpImage.onerror = () => {
        this._webpSupported = webpImage.height === 2;
        observer.next(this._webpSupported);
        observer.complete();
      };
    });
  }

  public static get pixelRatio(): number {
    return Math.ceil(window.devicePixelRatio);
  }

  public static isTouch(): Observable<boolean> {
    // https://www.sitepoint.com/javascript-media-queries
    // return window.matchMedia('(pointer: coarse)').matches; // Not working for firefox

    if (!this._isTouch) {
      const isTouch = window && 'ontouchstart' in window;

      this._isTouch = new BehaviorSubject<boolean>(isTouch);

      if (!isTouch) {
        fromEvent(window, 'touchstart')
          .pipe(take(1))
          .subscribe(() => this._isTouch.next(true));
      }
    }

    return this._isTouch.asObservable();
  }
}
