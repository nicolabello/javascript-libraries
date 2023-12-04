import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RouterHistoryService } from './services/router-history.service';

@NgModule({
  declarations: [],
  providers: [RouterHistoryService],
  imports: [CommonModule],
})
export class RouterHistoryModule {
  public constructor(routerHistoryService: RouterHistoryService) {
    // This is necessary because the service is constructed only when first injected
    routerHistoryService.init();
  }
}
