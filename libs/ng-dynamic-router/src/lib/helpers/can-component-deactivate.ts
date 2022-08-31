import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate(currentRoute: ActivatedRouteSnapshot, nextRoute: ActivatedRouteSnapshot): Observable<boolean>;
}
