import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { CommonValueAccessor } from './common-value-accessor';

describe('InputComponent', () => {
  @Component({
    template: ``,
    providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true },
      { provide: NG_VALIDATORS, useExisting: InputComponent, multi: true },
    ],
  })
  class InputComponent extends CommonValueAccessor<string> {}

  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InputComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('InputWrapperComponent', () => {
  @Component({
    template: ``,
    selector: `nb-input`,
    providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true },
      { provide: NG_VALIDATORS, useExisting: InputComponent, multi: true },
    ],
  })
  class InputComponent extends CommonValueAccessor<string> {}

  @Component({
    template: `
      <nb-input [(ngModel)]="value" #inputComponentByModel></nb-input>

      <nb-input
        [formControl]="formControl"
        #inputComponentByFormControl
      ></nb-input>

      <form [formGroup]="formGroup">
        <nb-input
          formControlName="formControl"
          #inputComponentByFormControlName
        ></nb-input>
      </form>
    `,
  })
  class InputWrapperComponent {
    public value = '';
    public formControl = new UntypedFormControl('');
    public formGroup = new UntypedFormGroup({
      formControl: new UntypedFormControl(''),
    });

    @ViewChild('inputComponentByModel')
    public inputComponentByModel?: InputComponent;
    @ViewChild('inputComponentByFormControl')
    public inputComponentByFormControl?: InputComponent;
    @ViewChild('inputComponentByFormControlName')
    public inputComponentByFormControlName?: InputComponent;
  }

  let component: InputWrapperComponent;
  let fixture: ComponentFixture<InputWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InputComponent, InputWrapperComponent],
        imports: [FormsModule, ReactiveFormsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate inputComponentByModel', () => {
    expect(component.inputComponentByModel).toBeTruthy();
  });

  it('should instantiate inputComponentByFormControl', () => {
    expect(component.inputComponentByFormControl).toBeTruthy();
  });

  it('should instantiate inputComponentByFormControlName', () => {
    expect(component.inputComponentByFormControlName).toBeTruthy();
  });
});

describe('InputComponent value', () => {
  @Component({
    template: ``,
    selector: `nb-input`,
    providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true },
      { provide: NG_VALIDATORS, useExisting: InputComponent, multi: true },
    ],
  })
  class InputComponent extends CommonValueAccessor<string> {}

  @Component({
    template: `
      <nb-input [(ngModel)]="model" #inputComponentByModel></nb-input>

      <nb-input
        [formControl]="formControl"
        #inputComponentByFormControl
      ></nb-input>

      <form [formGroup]="formGroup">
        <nb-input
          formControlName="formControl"
          #inputComponentByFormControlName
        ></nb-input>
      </form>
    `,
  })
  class InputWrapperComponent {
    public model = '';
    public formControl = new UntypedFormControl('');
    public formGroup = new UntypedFormGroup({
      formControl: new UntypedFormControl(''),
    });

    @ViewChild('inputComponentByModel')
    public inputComponentByModel?: InputComponent;
    @ViewChild('inputComponentByFormControl')
    public inputComponentByFormControl?: InputComponent;
    @ViewChild('inputComponentByFormControlName')
    public inputComponentByFormControlName?: InputComponent;
  }

  let component: InputWrapperComponent;
  let fixture: ComponentFixture<InputWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InputComponent, InputWrapperComponent],
        imports: [FormsModule, ReactiveFormsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test failing with "Cannot read property 'assertPresent' of null" if run with npm test
  xit('should input value properly for inputComponentByModel', fakeAsync(() => {
    const value = 'test input';
    component.model = value;
    fixture.detectChanges();
    tick(50);
    expect(component.inputComponentByModel?.value).toEqual(value);
  }));

  it('should input value properly for inputComponentByFormControl', () => {
    const value = 'test input';
    component.formControl.setValue(value);
    fixture.detectChanges();
    expect(component.inputComponentByFormControl?.value).toEqual(value);
  });

  it('should input value properly for inputComponentByFormControlName', () => {
    const value = 'test input';
    component.formGroup.setValue({ formControl: value });
    fixture.detectChanges();
    expect(component.inputComponentByFormControlName?.value).toEqual(value);
  });

  it('should output value properly for inputComponentByModel', () => {
    const value = 'test output';
    if (component.inputComponentByModel) {
      component.inputComponentByModel.value = value;
    }
    fixture.detectChanges();
    expect(component.model).toEqual(value);
  });

  it('should output value properly for inputComponentByFormControl', () => {
    const value = 'test output';
    if (component.inputComponentByFormControl) {
      component.inputComponentByFormControl.value = value;
    }
    fixture.detectChanges();
    expect(component.inputComponentByFormControl?.value).toEqual(value);
  });

  it('should output value properly for inputComponentByFormControlName', () => {
    const value = 'test output';
    if (component.inputComponentByFormControlName) {
      component.inputComponentByFormControlName.value = value;
    }
    fixture.detectChanges();
    expect(component.formGroup?.value).toEqual({ formControl: value });
  });
});

describe('InputComponent formatters', () => {
  const formatValueInputSuffix = '_input';
  const formatValueOutputSuffix = '_output';

  @Component({
    template: ``,
    selector: `nb-input`,
    providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true },
      { provide: NG_VALIDATORS, useExisting: InputComponent, multi: true },
    ],
  })
  class InputComponent extends CommonValueAccessor<string> {
    protected formatValueInput(value: any): string {
      return `${value}${formatValueInputSuffix}`;
    }

    protected formatValueOutput(value: string): any {
      return `${value}${formatValueOutputSuffix}`;
    }
  }

  @Component({
    template: `
      <nb-input [(ngModel)]="model" #inputComponentByModel></nb-input>

      <nb-input
        [formControl]="formControl"
        #inputComponentByFormControl
      ></nb-input>

      <form [formGroup]="formGroup">
        <nb-input
          formControlName="formControl"
          #inputComponentByFormControlName
        ></nb-input>
      </form>
    `,
  })
  class InputWrapperComponent {
    public model = '';
    public formControl = new UntypedFormControl('');
    public formGroup = new UntypedFormGroup({
      formControl: new UntypedFormControl(''),
    });

    @ViewChild('inputComponentByModel')
    public inputComponentByModel?: InputComponent;
    @ViewChild('inputComponentByFormControl')
    public inputComponentByFormControl?: InputComponent;
    @ViewChild('inputComponentByFormControlName')
    public inputComponentByFormControlName?: InputComponent;
  }

  let component: InputWrapperComponent;
  let fixture: ComponentFixture<InputWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InputComponent, InputWrapperComponent],
        imports: [FormsModule, ReactiveFormsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test failing with "Cannot read property 'assertPresent' of null" if run with npm test
  xit('should format input value properly for inputComponentByModel', fakeAsync(() => {
    const value = 'test input';
    component.model = value;
    fixture.detectChanges();
    tick(50);
    expect(component.inputComponentByModel?.value).toEqual(
      `${value}${formatValueInputSuffix}`
    );
  }));

  it('should format input value properly for inputComponentByFormControl', () => {
    const value = 'test input';
    component.formControl.setValue(value);
    fixture.detectChanges();
    expect(component.inputComponentByFormControl?.value).toEqual(
      `${value}${formatValueInputSuffix}`
    );
  });

  it('should format input value properly for inputComponentByFormControlName', () => {
    const value = 'test input';
    component.formGroup.setValue({ formControl: value });
    fixture.detectChanges();
    expect(component.inputComponentByFormControlName?.value).toEqual(
      `${value}${formatValueInputSuffix}`
    );
  });

  it('should format output value properly for inputComponentByModel', () => {
    const value = 'test output';
    if (component.inputComponentByModel) {
      component.inputComponentByModel.value = value;
    }
    fixture.detectChanges();
    expect(component.model).toEqual(`${value}${formatValueOutputSuffix}`);
  });

  it('should format output value properly for inputComponentByFormControl', () => {
    const value = 'test output wacca';
    if (component.inputComponentByFormControl) {
      component.inputComponentByFormControl.value = value;
    }
    fixture.detectChanges();
    expect(component.formControl?.value).toEqual(
      `${value}${formatValueOutputSuffix}`
    );
  });

  it('should format output value properly for inputComponentByFormControlName ', () => {
    const value = 'test output';
    if (component.inputComponentByFormControlName) {
      component.inputComponentByFormControlName.value = value;
    }
    fixture.detectChanges();
    expect(component.formGroup?.value).toEqual({
      formControl: `${value}${formatValueOutputSuffix}`,
    });
  });
});

describe('InputComponent validators', () => {
  const formControlValidators: ValidatorFn[] = [
    (formControl: AbstractControl) =>
      (formControl.value || '').match(/a/gi) ? null : { a: true },
    (formControl: AbstractControl) =>
      (formControl.value || '').match(/b/gi) ? null : { b: true },
  ];
  const inputValidators = [
    (formControl: AbstractControl) =>
      (formControl.value || '').match(/c/gi) ? null : { c: true },
    (formControl: AbstractControl) =>
      (formControl.value || '').match(/d/gi) ? null : { d: true },
  ];

  @Component({
    template: ``,
    selector: `nb-input`,
    providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true },
      { provide: NG_VALIDATORS, useExisting: InputComponent, multi: true },
    ],
  })
  class InputComponent extends CommonValueAccessor<string> {
    protected validators = inputValidators;
  }

  @Component({
    template: `
      <nb-input [(ngModel)]="model" #inputComponentByModel></nb-input>

      <nb-input
        [formControl]="formControl"
        #inputComponentByFormControl
      ></nb-input>

      <form [formGroup]="formGroup">
        <nb-input
          formControlName="formControl"
          #inputComponentByFormControlName
        ></nb-input>
      </form>
    `,
  })
  class InputWrapperComponent {
    public model = '';
    public formControl = new UntypedFormControl('', formControlValidators);
    public formGroup = new UntypedFormGroup({
      formControl: new UntypedFormControl('', formControlValidators),
    });

    @ViewChild('inputComponentByModel')
    public inputComponentByModel?: InputComponent;
    @ViewChild('inputComponentByFormControl')
    public inputComponentByFormControl?: InputComponent;
    @ViewChild('inputComponentByFormControlName')
    public inputComponentByFormControlName?: InputComponent;
  }

  let component: InputWrapperComponent;
  let fixture: ComponentFixture<InputWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InputComponent, InputWrapperComponent],
        imports: [FormsModule, ReactiveFormsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test failing with "Cannot read property 'assertPresent' of null" if run with npm test
  xit('should validate value properly for inputComponentByModel', fakeAsync(() => {
    const value = 'ac';
    component.model = value;
    fixture.detectChanges();
    tick(50);
    expect(component.inputComponentByModel?.invalid).toBe(true);
    const errors = component.inputComponentByModel?.errors;
    expect(errors).toEqual({ d: true });
  }));

  // Test failing with "Cannot read property 'assertPresent' of null" if run with npm test
  xit('should validate value properly for inputComponentByModel', fakeAsync(() => {
    const value = 'abcd';
    component.model = value;
    fixture.detectChanges();
    tick(50);
    expect(component.inputComponentByModel?.invalid).toBe(false);
    const errors = component.inputComponentByModel?.errors;
    expect(errors).toEqual(null);
  }));

  it('should format input value properly for inputComponentByFormControl', () => {
    const value = 'ac';
    component.formControl.setValue(value);
    fixture.detectChanges();
    expect(component.inputComponentByFormControl?.invalid).toBe(true);
    const errors = component.inputComponentByFormControl?.errors;
    expect(errors).toEqual({ b: true, d: true });
  });

  it('should format input value properly for inputComponentByFormControl', () => {
    const value = 'abcd';
    component.formControl.setValue(value);
    fixture.detectChanges();
    expect(component.inputComponentByFormControl?.invalid).toBe(false);
    const errors = component.inputComponentByFormControl?.errors;
    expect(errors).toEqual(null);
  });

  it('should format input value properly for inputComponentByFormControlName', () => {
    const value = 'ac';
    component.formGroup.setValue({ formControl: value });
    fixture.detectChanges();
    expect(component.inputComponentByFormControlName?.invalid).toBe(true);
    const errors = component.inputComponentByFormControlName?.errors;
    expect(errors).toEqual({ b: true, d: true });
  });

  it('should format input value properly for inputComponentByFormControlName', () => {
    const value = 'abcd';
    component.formGroup.setValue({ formControl: value });
    fixture.detectChanges();
    expect(component.inputComponentByFormControlName?.invalid).toBe(false);
    const errors = component.inputComponentByFormControlName?.errors;
    expect(errors).toEqual(null);
  });
});
