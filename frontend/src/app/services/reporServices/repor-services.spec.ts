import { TestBed } from '@angular/core/testing';

import { ReporServices } from './repor-services';

describe('ReporServices', () => {
  let service: ReporServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
