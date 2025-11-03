import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagAdminReportes } from './pag-admin-reportes';

describe('PagAdminReportes', () => {
  let component: PagAdminReportes;
  let fixture: ComponentFixture<PagAdminReportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagAdminReportes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagAdminReportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
