import { TestBed } from '@angular/core/testing';

import { UrlConstService } from './url-const.service';

describe('UrlConstService', () => {
  let service: UrlConstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlConstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
