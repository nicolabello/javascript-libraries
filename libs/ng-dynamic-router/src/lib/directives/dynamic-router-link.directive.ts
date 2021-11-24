import { Directive, HostListener, Input } from '@angular/core';
import { DynamicRouterService } from '../services/dynamic-router.service';

@Directive({
  selector: '[nbDynamicRouterLink]',
})
export class DynamicRouterLinkDirective {
  @Input('nbDynamicRouterLink') private commands?: any[];

  constructor(private routerService: DynamicRouterService) {}

  @HostListener('click')
  public onClick(): void {
    this.routerService.navigate(this.commands || []);
  }
}
