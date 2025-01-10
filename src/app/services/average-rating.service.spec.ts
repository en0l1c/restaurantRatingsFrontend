import { TestBed } from '@angular/core/testing';

import { AverageRatingService } from './average-rating.service';

describe('AverageRatingService', () => {
  let service: AverageRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AverageRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
