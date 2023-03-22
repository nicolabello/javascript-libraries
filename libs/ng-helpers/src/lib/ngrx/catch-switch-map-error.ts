import { catchError, Observable, startWith } from 'rxjs';

// https://jcs.wtf/catch-switchmap-error-rxjs-operator/
export const catchSwitchMapError =
  (errorAction: (error: any) => any) =>
  <T>(source: Observable<T>) =>
    source.pipe(catchError((error, innerSource) => innerSource.pipe(startWith(errorAction(error)))));
