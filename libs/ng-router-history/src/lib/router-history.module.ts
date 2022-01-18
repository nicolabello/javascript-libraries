import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterHistoryService } from './services/router-history.service';

@NgModule({
  declarations: [],
  providers: [RouterHistoryService],
  imports: [CommonModule],
})
export class RouterHistoryModule {
  constructor(routerHistoryService: RouterHistoryService) {
    // This is necessary because the service is constructed only when first injected
    routerHistoryService.init();
  }
}
