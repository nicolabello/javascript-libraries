import {Route} from '@angular/router';
import {DynamicRouterComponent} from '../components/dynamic-router/dynamic-router.component';
import {CanDeactivateGuard} from '../services/guards/can-deactivate.guard';

export function dynamicRoute(route: Route): Route {
  return {
    ...route,
    data: {
      ...(route.data || {}),
      component: route.component,
    },
    component: DynamicRouterComponent,
    canDeactivate: [
      CanDeactivateGuard,
      ...(route.canDeactivate ? (Array.isArray(route.canDeactivate) ? route.canDeactivate : [route.canDeactivate]) : []),
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  };
}
