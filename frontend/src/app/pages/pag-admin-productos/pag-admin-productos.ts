import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos';

@Component({
  selector: 'app-pag-admin-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pag-admin-productos.html',
  styles: ``,
})
export class PagAdminProductos implements OnInit {

    productos: any[] = [];
  cargando = false;

  constructor(private productosService: ProductosService) {
  }

  ngOnInit(): void {
    this.cargarProductos()
  }  

  cargarProductos() {
    this.cargando = true;
    
    this.productosService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al cargar productos:', err);
      }
    });
  }

}
