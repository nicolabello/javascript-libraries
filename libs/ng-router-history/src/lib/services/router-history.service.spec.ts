import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { provideRouterHistory } from '../provide-router-history';

import { RouterHistoryService } from './router-history.service';

@Component({ template: '' })
class PageComponent {}

describe('RouterHistoryService', () => {
  let service: RouterHistoryService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'a', component: PageComponent },
          { path: 'b', component: PageComponent },
          { path: 'fallback', component: PageComponent },
        ]),
        provideRouterHistory(),
      ],
    });
    service = TestBed.inject(RouterHistoryService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not allow navigating back on the first page', async () => {
    await router.navigateByUrl('/a');
    expect(service.currentUrlSnapshot).toBe('/a');
    expect(service.previousUrlSnapshot).toBeNull();
    expect(await firstValueFrom(service.canNavigateBack)).toBe(false);
  });

  it('should track the previous url', async () => {
    await router.navigateByUrl('/a');
    await router.navigateByUrl('/b');
    expect(service.currentUrlSnapshot).toBe('/b');
    expect(service.previousUrlSnapshot).toBe('/a');
    expect(await firstValueFrom(service.canNavigateBack)).toBe(true);
  });

  it('should navigate to the fallback when there is no previous url', async () => {
    await router.navigateByUrl('/a');
    service.navigateBack(['/fallback']);
    // navigateBack() does not return the navigation promise, so wait for it to settle
    await new Promise((resolve) => setTimeout(resolve));
    expect(router.url).toBe('/fallback');
  });

  it('should be safe to initialise more than once', async () => {
    service.init();
    await router.navigateByUrl('/a');
    await router.navigateByUrl('/b');
    expect(service.previousUrlSnapshot).toBe('/a');
  });
});
