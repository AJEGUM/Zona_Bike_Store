import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagPasarela } from './pag-pasarela';

describe('PagPasarela', () => {
  let component: PagPasarela;
  let fixture: ComponentFixture<PagPasarela>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagPasarela]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagPasarela);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
