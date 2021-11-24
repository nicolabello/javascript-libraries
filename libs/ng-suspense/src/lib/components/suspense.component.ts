import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SuspenseData, SuspenseError, SuspenseInput, SuspenseLoading} from '../types/suspense';
import {SuspenseService} from '../services/suspense.service';

@Component({
  selector: 'nb-suspense',
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SuspenseService],
})
export class SuspenseComponent implements OnInit, OnDestroy {

  private changesSubscription?: Subscription;

  constructor(private cdr: ChangeDetectorRef, private suspenseService: SuspenseService) {
  }

  @Input()
  public set data(value: SuspenseInput<SuspenseData>) {
    this.suspenseService.data.init(value);
  }

  @Input()
  public set loading(value: SuspenseInput<SuspenseLoading>) {
    this.suspenseService.loading.init(value);
  }

  @Input()
  public set error(value: SuspenseInput<SuspenseError>) {
    this.suspenseService.error.init(value);
  }

  public ngOnInit(): void {
    this.changesSubscription = this.suspenseService.valuesChanges.subscribe(() => this.cdr.markForCheck());
  }

  public ngOnDestroy(): void {
    this.changesSubscription?.unsubscribe();
  }

}
