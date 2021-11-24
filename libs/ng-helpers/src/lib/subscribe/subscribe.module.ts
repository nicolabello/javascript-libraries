import { NgModule } from '@angular/core';
import { SubscribeDirective } from './subscribe.directive';

@NgModule({
  declarations: [SubscribeDirective],
  exports: [SubscribeDirective],
})
export class SubscribeModule {}
