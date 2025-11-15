import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPromociones } from './banner-promociones';

describe('BannerPromociones', () => {
  let component: BannerPromociones;
  let fixture: ComponentFixture<BannerPromociones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerPromociones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerPromociones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
