import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SuspenseComponent } from '../components/suspense.component';
import { SuspenseIfErrorDirective } from './suspense-if-error.directive';

const testCases = [
  {
    data: null,
    loading: false,
    error: null,
    visible: false,
  },
  {
    data: null,
    loading: false,
    error: 'ops',
    visible: true,
  },
  {
    data: null,
    loading: true,
    error: null,
    visible: false,
  },
  {
    data: null,
    loading: true,
    error: 'ops',
    visible: false,
  },
  {
    data: 'data',
    loading: false,
    error: null,
    visible: false,
  },
  {
    data: 'data',
    loading: false,
    error: 'ops',
    visible: true,
  },
  {
    data: 'data',
    loading: true,
    error: null,
    visible: false,
  },
  {
    data: 'data',
    loading: true,
    error: 'ops',
    visible: false,
  },
];

@Component({
  template: `
    <nb-suspense [data]="data" [loading]="loading" [error]="error">
      <ng-container *nbSuspenseIfError="let error"
        >Error: {{ error }}</ng-container
      >
    </nb-suspense>
  `,
})
class TestComponent {
  public data: any;
  public loading: any;
  public error: any;

  @ViewChild(SuspenseIfErrorDirective)
  public suspenseIfDirective?: SuspenseIfErrorDirective<any>;
}

describe('SuspenseIfErrorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: SuspenseIfErrorDirective<any> | undefined;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          TestComponent,
          SuspenseComponent,
          SuspenseIfErrorDirective,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable();
    directive = component.suspenseIfDirective;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should be visible when expected', () => {
    for (const testCase of testCases) {
      component.data = testCase.data;
      component.loading = testCase.loading;
      component.error = testCase.error;

      fixture.detectChanges();
      fixture.whenStable();

      expect(directive?.value).toBe(testCase.error);
      testCase.visible
        ? expect(directive?.isVisible).toBeTruthy()
        : expect(directive?.isVisible).toBeFalsy();
    }
  });
});
