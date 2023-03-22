import { Observable, of } from 'rxjs';

export function fromIntersectionObserver(
  target: Element,
  options?: IntersectionObserverInit
): Observable<Partial<IntersectionObserverEntry>> {
  if ('IntersectionObserver' in (window as Window)) {
    return new Observable<IntersectionObserverEntry>((observer) => {
      const intersectionObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => observer.next(entry)),
        options
      );
      intersectionObserver.observe(target);

      // Cleanup
      return () => intersectionObserver.disconnect();
    });
  } else {
    const targetRect = target.getBoundingClientRect();
    const rootRect = new DOMRectReadOnly(0, 0, (window as Window).innerWidth, (window as Window).innerHeight);

    return of({
      boundingClientRect: targetRect,
      intersectionRatio: 1,
      intersectionRect: targetRect,
      isIntersecting: true,
      rootBounds: rootRect,
      target,
      time: 0,
    });
  }
}
