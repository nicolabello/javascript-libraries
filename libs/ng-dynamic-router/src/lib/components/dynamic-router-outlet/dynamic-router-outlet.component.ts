import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { SubscriptionsBucket } from '@nicolabello/ng-helpers';

import { HistoryRoute } from '../../helpers/history-route';
import { NavigationDirection } from '../../models/navigation-direction';
import { DynamicRouterService } from '../../services/dynamic-router.service';

@Component({
  selector: 'nb-dynamic-router-outlet',
  templateUrl: './dynamic-router-outlet.component.html',
  styleUrls: ['./dynamic-router-outlet.component.scss'],
  // providers: [DynamicRouterService],
  animations: [
    trigger('slide', [
      transition(`* => ${NavigationDirection.Backward}`, [
        style({
          transform: 'translateX(-100%)',
        }),
        animate('225ms ease-out'),
      ]),
      transition(`* => ${NavigationDirection.Forward}`, [
        style({
          transform: 'translateX(100%)',
        }),
        animate('225ms ease-out'),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicRouterOutletComponent implements OnDestroy, OnInit {
  public animationDirection: NavigationDirection | null = null;

  @ViewChild('outlet', { read: ViewContainerRef, static: true })
  private viewContainerRef!: ViewContainerRef;

  private subscriptions = new SubscriptionsBucket();
  private route?: HistoryRoute;
  private componentRef?: ComponentRef<any>;

  public constructor(
    private routerService: DynamicRouterService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  private static hasSameUrl(currentRoute: HistoryRoute, newRoute: HistoryRoute): boolean {
    return currentRoute.url === newRoute.url;
  }

  private static hasBeenReplaced(currentRoute: HistoryRoute, newRoute: HistoryRoute): boolean {
    return (
      currentRoute.component === newRoute.component &&
      newRoute.replaced &&
      newRoute.direction === NavigationDirection.Forward
    );
  }

  private static closingSubviewAfterPersistingItem(currentRoute: HistoryRoute, newRoute: HistoryRoute): boolean {
    return (
      newRoute.params.id === 'new' &&
      newRoute.direction === NavigationDirection.Backward &&
      newRoute.component === currentRoute.component
    );
  }

  private static similarRoutes(currentRoute: HistoryRoute, newRoute: HistoryRoute): boolean {
    /*console.group('similarRoutes');
    console.log('hasSameUrl', this.hasSameUrl(currentRoute, newRoute));
    console.log('hasBeenReplaced', this.hasBeenReplaced(currentRoute, newRoute));
    console.log('closingSubviewAfterPersistingItem', this.closingSubviewAfterPersistingItem(currentRoute, newRoute));
    console.log('result', this.hasSameUrl(currentRoute, newRoute)
    || this.hasBeenReplaced(currentRoute, newRoute) || this.closingSubviewAfterPersistingItem(currentRoute, newRoute));
    console.groupEnd();*/
    return (
      this.hasSameUrl(currentRoute, newRoute) ||
      this.hasBeenReplaced(currentRoute, newRoute) ||
      this.closingSubviewAfterPersistingItem(currentRoute, newRoute)
    );
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.routerService.route.subscribe((route) => this.showComponent(route)));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribeAll();
  }

  public onAnimationDone(): void {
    this.animationDirection = null;
    if (this.route) {
      this.routerService.animatingSubject.next(false);
    }
  }

  /*private getInjector(route: Route): Injector {
    return Injector.create({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: route.activatedRoute,
        },
      ],
      parent: this.injector,
    });
  }*/

  private showComponent(route: HistoryRoute): void {
    if (!(this.route && DynamicRouterOutletComponent.similarRoutes(this.route, route))) {
      // Clear view, it destroys the component as well
      this.viewContainerRef.clear();

      // Create component
      this.componentRef = this.viewContainerRef.createComponent(route.component, { injector: this.injector });

      // Animate only if view is not empty
      const animationDirection = this.route ? route.direction : null;

      if (animationDirection) {
        this.routerService.animatingSubject.next(true);
        this.animationDirection = animationDirection;
      } else {
        this.routerService.animatingSubject.next(false);
      }

      // Detect changes (component was not updating on back and same component)
      this.cdr.markForCheck();
    }

    this.route = route;
  }
}
