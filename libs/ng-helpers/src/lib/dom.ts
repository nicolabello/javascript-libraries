export class Dom {
  public static get focusedElement(): Element | null {
    return window.document.activeElement;
  }

  public static isFocused(element: HTMLElement): boolean {
    return window.document.activeElement === element;
  }

  public static blurFocusedElement(): void {
    const element = this.focusedElement;
    if (element instanceof HTMLElement) {
      element.blur();
    }
  }

  public static getScrollingParent(element: Element | null): Element | null {
    if (!element) {
      return null;
    }

    if (element.scrollHeight > element.clientHeight) {
      return element;
    } else {
      return this.getScrollingParent(element.parentElement);
    }
  }
}
