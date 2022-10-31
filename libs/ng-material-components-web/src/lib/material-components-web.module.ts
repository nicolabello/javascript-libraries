import { NgModule } from '@angular/core';
import { ListDirective } from './directives/list.directive';
import { MenuDirective } from './directives/menu.directive';
import { RippleUnboundedDirective } from './directives/ripple-unbounded.directive';
import { RippleDirective } from './directives/ripple.directive';
import { SelectDirective } from './directives/select.directive';
import { SelectHelperTextDirective } from './directives/select-helper-text.directive';
import { SwitchDirective } from './directives/switch.directive';
import { TabBarDirective } from './directives/tab-bar.directive';
import { TextFieldDirective } from './directives/text-field.directive';
import { TextFieldHelperTextDirective } from './directives/text-field-helper-text.directive';
import { TopAppBarDirective } from './directives/top-app-bar.directive';
import { LinearProgressDirective } from './directives/linear-progress.directive';
import { CircularProgressDirective } from './directives/circular-progress.directive';

const directives = [
  ListDirective,
  MenuDirective,
  RippleDirective,
  SelectDirective,
  SelectHelperTextDirective,
  SwitchDirective,
  TabBarDirective,
  TextFieldDirective,
  TextFieldHelperTextDirective,
  TopAppBarDirective,
  LinearProgressDirective,
  CircularProgressDirective,
  RippleUnboundedDirective,
];

@NgModule({
  declarations: directives,
  exports: directives,
})
export class MaterialComponentsWebModule {}
