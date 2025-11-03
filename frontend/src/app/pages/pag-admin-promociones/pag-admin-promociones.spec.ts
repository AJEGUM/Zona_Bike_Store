import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagAdminPromociones } from './pag-admin-promociones';

describe('PagAdminPromociones', () => {
  let component: PagAdminPromociones;
  let fixture: ComponentFixture<PagAdminPromociones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagAdminPromociones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagAdminPromociones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
