import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterHistoryService } from './router-history.service';

describe('RouterHistoryService', () => {
  let service: RouterHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterHistoryService],
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(RouterHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
