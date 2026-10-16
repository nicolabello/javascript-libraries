import { NgModule } from '@angular/core';

import { SubscribeDirective } from './subscribe.directive';

@NgModule({
  imports: [SubscribeDirective],
  exports: [SubscribeDirective],
})
export class SubscribeModule {}
