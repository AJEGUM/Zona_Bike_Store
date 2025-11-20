import { TestBed } from '@angular/core/testing';

import { Pasarela } from './pasarela';

describe('Pasarela', () => {
  let service: Pasarela;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pasarela);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
