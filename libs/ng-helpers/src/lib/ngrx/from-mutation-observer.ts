import { EMPTY, Observable } from 'rxjs';

export function fromMutationObserver(
  target: Node,
  options?: MutationObserverInit
): Observable<MutationRecord> {
  if (window && 'MutationObserver' in window) {
    return new Observable<MutationRecord>((observer) => {
      const mutationObserver = new MutationObserver((records) =>
        records.forEach((record) => observer.next(record))
      );
      mutationObserver.observe(target, options);

      // Cleanup
      return () => mutationObserver.disconnect();
    });
  } else {
    return EMPTY;
  }
}
