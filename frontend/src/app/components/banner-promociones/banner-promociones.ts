import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Promociones } from '../../services/promociones/promociones';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-promociones.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BannerPromociones implements OnInit {

  promociones: any[] = [];

  constructor(private promocionesService: Promociones) {}

  ngOnInit(): void {
    this.promocionesService.listarPromociones().subscribe((data: any[]) => {
      this.promociones = data
        .filter(p => p.estado === 'activa')
        .map(p => ({
          ...p,
          imagen: "data:image/jpeg;base64," + p.imagen
        }));
    });
  }

}
