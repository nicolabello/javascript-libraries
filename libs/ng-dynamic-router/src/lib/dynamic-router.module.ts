import {LocationStrategy} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DynamicRouterOutletComponent} from './components/dynamic-router-outlet/dynamic-router-outlet.component';
import {DynamicRouterSubviewComponent} from './components/dynamic-router-subview/dynamic-router-subview.component';
import {DynamicRouterComponent} from './components/dynamic-router/dynamic-router.component';
import {DynamicRouterLinkDirective} from './directives/dynamic-router-link.directive';
import {DynamicRouterLinkActivePipe} from './pipes/dynamic-router-link-active.pipe';
import {DynamicRouterService} from './services/dynamic-router.service';
import {CanDeactivateGuard} from './services/guards/can-deactivate.guard';
import {HistoryLocationStrategy} from './services/history-location-strategy.service';
import {HistoryRouterService} from './services/history-router.service';

@NgModule({
  declarations: [
    DynamicRouterOutletComponent,
    DynamicRouterLinkDirective,
    DynamicRouterLinkActivePipe,
    DynamicRouterComponent,
    DynamicRouterSubviewComponent,
  ],
  imports: [
    RouterModule,
  ],
  providers: [
    HistoryRouterService,
    DynamicRouterService,
    CanDeactivateGuard,
  ],
  exports: [
    DynamicRouterOutletComponent,
    DynamicRouterLinkDirective,
    DynamicRouterLinkActivePipe,
    DynamicRouterSubviewComponent,
  ],
})
export class DynamicRouterModule {

  public static forRoot(): ModuleWithProviders<DynamicRouterModule> {
    return {
      ngModule: DynamicRouterModule,
      providers: [
        HistoryLocationStrategy,
        {provide: LocationStrategy, useExisting: HistoryLocationStrategy},
      ],
    };
  }

  public static forChild(): ModuleWithProviders<DynamicRouterModule> {
    return {
      ngModule: DynamicRouterModule,
    };
  }

}
