import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagProductos } from './pag-productos';

describe('PagProductos', () => {
  let component: PagProductos;
  let fixture: ComponentFixture<PagProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
