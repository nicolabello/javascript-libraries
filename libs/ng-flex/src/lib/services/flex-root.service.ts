import { Injectable } from '@angular/core';

@Injectable()
export class FlexRootService {
  private _hostElement!: HTMLElement;

  public get hostElement(): HTMLElement {
    return this._hostElement;
  }

  public set hostElement(element: HTMLElement) {
    this._hostElement = this._hostElement || element;
  }
}
