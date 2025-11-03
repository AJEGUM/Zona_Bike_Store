import { TestBed } from '@angular/core/testing';

import { PromServices } from './prom-services';

describe('PromServices', () => {
  let service: PromServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
