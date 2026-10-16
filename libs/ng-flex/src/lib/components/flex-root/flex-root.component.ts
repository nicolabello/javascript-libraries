import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';

import { FlexRootService } from '../../services/flex-root.service';

@Component({
  selector: 'nb-flex-root',
  templateUrl: './flex-root.component.html',
  styleUrls: ['./flex-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FlexRootService],
})
export class FlexRootComponent {
  public constructor() {
    const hostElementRef = inject(ElementRef);
    const flexRootService = inject(FlexRootService);

    flexRootService.hostElement = hostElementRef.nativeElement;
  }
}
