import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { FlexRootService } from '../../services/flex-root.service';

@Component({
  selector: 'nb-flex-root',
  templateUrl: './flex-root.component.html',
  styleUrls: ['./flex-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FlexRootService],
})
export class FlexRootComponent {
  constructor(hostElementRef: ElementRef, flexRootService: FlexRootService) {
    flexRootService.hostElement = hostElementRef.nativeElement;
  }
}
