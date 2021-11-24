import {EMPTY, fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

interface ResizeObserverOptions {
  box?: 'content-box' | 'border-box';
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
}

export function fromResizeObserver(target: Element, options?: ResizeObserverOptions): Observable<ResizeObserverEntry> {

  if (window && 'ResizeObserver' in window) {

    return new Observable(observer => {

      // @ts-ignore
      const resizeObserver = new ResizeObserver(entries => entries.forEach(entry => observer.next(entry)));
      resizeObserver.observe(target, options);

      // Cleanup
      return () => resizeObserver.disconnect();

    });

  } else {

    return window ? fromEvent(window, 'resize').pipe(
      debounceTime(100),
      map(() => target.getBoundingClientRect()),
      distinctUntilChanged((before, after) => JSON.stringify(before) === JSON.stringify(after)),
      map(contentRect => ({target, contentRect})),
    ) : EMPTY;

  }

}
