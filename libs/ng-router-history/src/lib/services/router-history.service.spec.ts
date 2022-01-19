import { TestBed } from '@angular/core/testing';
import { RouterHistoryService } from './router-history.service';
import { RouterTestingModule } from '@angular/router/testing';

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
