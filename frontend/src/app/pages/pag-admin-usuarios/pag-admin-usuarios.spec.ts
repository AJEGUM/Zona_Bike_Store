import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagAdminUsuarios } from './pag-admin-usuarios';

describe('PagAdminUsuarios', () => {
  let component: PagAdminUsuarios;
  let fixture: ComponentFixture<PagAdminUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagAdminUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagAdminUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
