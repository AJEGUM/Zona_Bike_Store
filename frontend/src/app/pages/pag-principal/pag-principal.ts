import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productosServices/productos-services';

@Component({
  selector: 'app-pag-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pag-principal.html',
})
export class PagPrincipal implements OnInit {

  productos: any[] = [];

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.obtenerProductos().subscribe(data => {
      this.productos = data;
      console.log("PRODUCTOS CARGADOS:", this.productos);
    });
  }

  obtenerImagen(prod: any) {
    if (!prod.imagen) return 'assets/no-image.png';

    // Si viene base64 crudo
    if (!prod.imagen.startsWith('data:image')) {
      return 'data:image/jpeg;base64,' + prod.imagen;
    }

    // Si ya viene completo
    return prod.imagen;
  }
}
