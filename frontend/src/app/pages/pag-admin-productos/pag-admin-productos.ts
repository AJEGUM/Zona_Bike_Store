import { Component } from '@angular/core';
import { ProductosService, Producto } from '../../services/productosServices/productos-services';
import { CommonModule } from '@angular/common';
import { ModalProducto } from '../../components/modal-producto/modal-producto';

@Component({
  selector: 'app-pag-admin-productos',
  standalone: true,
  imports: [CommonModule, ModalProducto],
  templateUrl: './pag-admin-productos.html',
  styles: ``,
})
export class PagAdminProductos {
  productos: Producto[] = [];
  cargando = true;
  modalAbierto = false;

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();

    // Suscripción simple, igual que usuarios
    this.productosService.productoCreado$.subscribe((producto: Producto) => {
      // Solo agregamos nuevos productos al array
      this.productos = [...this.productos, producto];
    });
  }

  cargarProductos() {
    this.cargando = true;
    this.productosService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => this.cargando = false,
    });
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  agregarProductoALista(producto: Producto) {
    this.productos = [...this.productos, producto];
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      this.productosService.eliminarProducto(id).subscribe({
        next: () => this.productos = this.productos.filter(p => p.id_producto !== id),
      });
    }
  }
}
