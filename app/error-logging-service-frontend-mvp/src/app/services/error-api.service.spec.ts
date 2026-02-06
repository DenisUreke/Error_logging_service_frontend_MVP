import { TestBed } from '@angular/core/testing';

import { ErrorApiService } from './error-api.service';

describe('ErrorApiService', () => {
  let service: ErrorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
