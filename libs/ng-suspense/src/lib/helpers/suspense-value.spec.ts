import { waitForAsync } from '@angular/core/testing';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SuspenseValue } from './suspense-value';

describe('SuspenseValue', () => {
  let suspenseValue: SuspenseValue;

  beforeEach(() => {
    suspenseValue = new SuspenseValue();
  });

  it('should allow observables', (done) => {
    const source = from(['1st', '2nd']).pipe(
      tap((value: string) => {
        if (value === '2nd') {
          expect(suspenseValue.value).toBe('1st');
          expect(suspenseValue.booleanValue).toBe(true);
          done();
        }
      })
    );
    suspenseValue.init(source);
  });

  it('should allow promises', waitForAsync(async () => {
    const source = new Promise((resolve) => {
      resolve('test');
    });
    await suspenseValue.init(source);
    expect(suspenseValue.value).toBe('test');
    expect(suspenseValue.booleanValue).toBe(true);
  }));

  it('should allow simple values', waitForAsync(async () => {
    await suspenseValue.init('test');
    expect(suspenseValue.value).toBe('test');
    expect(suspenseValue.booleanValue).toBe(true);
  }));

  it('should convert strings to boolean', () => {
    const value = 'test';
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(true);
  });

  it('should convert strings to boolean', () => {
    const value = '';
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(false);
  });

  it('should convert numbers to boolean', () => {
    const value = 1;
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(true);
  });

  it('should convert numbers to boolean', () => {
    const value = 0;
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(true);
  });

  it('should convert arrays to boolean', () => {
    const value: [] = [];
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(false);
  });

  it('should convert arrays to boolean', () => {
    const value = ['tests'];
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(true);
  });

  it('should convert objects to boolean', () => {
    const value = {};
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(false);
  });

  it('should convert objects to boolean', () => {
    const value = { a: 'b' };
    suspenseValue.init(value);
    expect(suspenseValue.value).toBe(value);
    expect(suspenseValue.booleanValue).toBe(true);
  });
});
