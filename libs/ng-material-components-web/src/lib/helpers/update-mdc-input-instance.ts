import { MDCInputComponent } from '../models/mdc-input-component';

export const toInputValue = (value: any): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return `${value}`;
  }
  return '';
};

function conditionallyUpdateAttribute<T extends MDCInputComponent>(instance: T, attribute: keyof T, value: any): void {
  if (instance[attribute] !== value) {
    instance[attribute] = value;
  }
}

export function updateMDCInputInstance<T extends MDCInputComponent>(instance?: T, props?: MDCInputComponent): void {
  if (instance && props) {
    conditionallyUpdateAttribute(instance, 'value', toInputValue(props.value));
    conditionallyUpdateAttribute(instance, 'required', props.required);
    conditionallyUpdateAttribute(instance, 'disabled', props.disabled);
    conditionallyUpdateAttribute(instance, 'valid', props.valid);
  }
}
