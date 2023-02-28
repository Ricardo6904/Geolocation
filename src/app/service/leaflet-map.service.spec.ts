import { TestBed } from '@angular/core/testing';

import { LeafletMapService } from './leaflet-map.service';

describe('LeafletMapService', () => {
  let service: LeafletMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeafletMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
