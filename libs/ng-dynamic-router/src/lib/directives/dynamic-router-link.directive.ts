import { Directive, HostListener, inject, Input } from '@angular/core';

import { DynamicRouterService } from '../services/dynamic-router.service';

@Directive({ selector: '[nbDynamicRouterLink]' })
export class DynamicRouterLinkDirective {
  private routerService = inject(DynamicRouterService);

  @Input('nbDynamicRouterLink') public commands?: any[];

  @HostListener('click')
  public onClick(): void {
    this.routerService.navigate(this.commands || []);
  }
}
