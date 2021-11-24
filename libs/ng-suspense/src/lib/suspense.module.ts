import { NgModule } from '@angular/core';
import { SuspenseComponent } from './components/suspense.component';
import { SuspenseIfDataDirective } from './directives/suspense-if-data.directive';
import { SuspenseIfEmptyDirective } from './directives/suspense-if-empty.directive';
import { SuspenseIfErrorDirective } from './directives/suspense-if-error.directive';
import { SuspenseIfLoadingDirective } from './directives/suspense-if-loading.directive';

const items = [
  SuspenseComponent,
  SuspenseIfEmptyDirective,
  SuspenseIfDataDirective,
  SuspenseIfErrorDirective,
  SuspenseIfLoadingDirective,
];

@NgModule({
  declarations: items,
  exports: items,
})
export class SuspenseModule {}
