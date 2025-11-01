import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagAdminProductos } from './pag-admin-productos';

describe('PagAdminProductos', () => {
  let component: PagAdminProductos;
  let fixture: ComponentFixture<PagAdminProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagAdminProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagAdminProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
