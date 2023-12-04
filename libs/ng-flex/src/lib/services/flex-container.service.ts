import { Injectable } from '@angular/core';

import { FlexContainerDirective } from '../directives/flex-container/flex-container.directive';

@Injectable()
export class FlexContainerService {
  private _flexContainer!: FlexContainerDirective;

  public get flexContainer(): FlexContainerDirective {
    return this._flexContainer;
  }

  public set flexContainer(flexContainer: FlexContainerDirective) {
    this._flexContainer = this._flexContainer || flexContainer;
  }
}
