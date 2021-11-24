import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {DynamicRouterService} from '../services/dynamic-router.service';

@Pipe({
  name: 'nbDynamicRouterLinkActive',
})
export class DynamicRouterLinkActivePipe implements PipeTransform {

  constructor(private routerService: DynamicRouterService) {
  }

  public transform(commands: any[]): Observable<boolean> {
    // const url = this.router.serializeUrl(this.router.createUrlTree(commands));
    const url = commands.join('/');
    return this.routerService.isActive(url);
  }

}
