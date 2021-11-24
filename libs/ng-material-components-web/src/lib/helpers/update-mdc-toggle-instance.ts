import { MDCToggleComponent } from '../models/mdc-toggle-component';

export const toBooleanValue = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase() === 'true';
  }
  return value === true;
};

function conditionallyUpdateAttribute<T extends MDCToggleComponent>(
  instance: T,
  attribute: keyof T,
  value: any
): void {
  if (instance[attribute] !== value) {
    instance[attribute] = value;
  }
}

export function updateMDCToggleInstance<T extends MDCToggleComponent>(
  instance?: T,
  props?: MDCToggleComponent
): void {
  if (instance && props) {
    conditionallyUpdateAttribute(
      instance,
      'selected',
      toBooleanValue(props.selected)
    );
    conditionallyUpdateAttribute(instance, 'disabled', props.disabled);
  }
}
