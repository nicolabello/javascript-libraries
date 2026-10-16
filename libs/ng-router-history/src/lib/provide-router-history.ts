import { EnvironmentProviders, inject, makeEnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';

import { RouterHistoryService } from './services/router-history.service';

/**
 * Provides `RouterHistoryService` and starts tracking navigation as soon as the application starts.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideRouter(routes), provideRouterHistory()],
 * });
 * ```
 */
export function provideRouterHistory(): EnvironmentProviders {
  return makeEnvironmentProviders([
    RouterHistoryService,
    provideEnvironmentInitializer(() => inject(RouterHistoryService).init()),
  ]);
}
