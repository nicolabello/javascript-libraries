import { Injectable } from '@angular/core';
import { FlexPaneDirective } from '../directives/flex-pane/flex-pane.directive';

@Injectable()
export class FlexPaneService {
  private _flexPane!: FlexPaneDirective;

  public get flexPane(): FlexPaneDirective {
    return this._flexPane;
  }

  public set flexPane(flexPane: FlexPaneDirective) {
    this._flexPane = this._flexPane || flexPane;
  }
}
