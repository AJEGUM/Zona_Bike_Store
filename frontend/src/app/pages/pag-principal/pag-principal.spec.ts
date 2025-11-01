import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagPrincipal } from './pag-principal';

describe('PagPrincipal', () => {
  let component: PagPrincipal;
  let fixture: ComponentFixture<PagPrincipal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagPrincipal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagPrincipal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
