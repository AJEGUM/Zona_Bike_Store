import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productosServices/productos-services';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Carrito } from '../../services/carrito/carrito';

@Component({
  selector: 'app-pag-principal',
  standalone: true,
  imports: [CommonModule, NavBar],
  templateUrl: './pag-principal.html',
})
export class PagPrincipal implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = []; 
  mensajeToast: string | null = null;


  constructor(
    private productosService: ProductosService,
    private carritoService: Carrito
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.obtenerProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data;
        this.productosFiltrados = data;
        console.log("Productos cargados:", this.productos);
      },
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  obtenerImagen(prod: any) {
    if (!prod.imagen) return 'assets/no-image.png';
    if (!prod.imagen.startsWith('data:image')) {
      return 'data:image/jpeg;base64,' + prod.imagen;
    }
    return prod.imagen;
  }

  filtrarProductos(term: string) {
    if (!term) {
      this.productosFiltrados = this.productos;
      return;
    }
    const lowerTerm = term.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(lowerTerm)
    );
  }

agregarAlCarrito(producto: any) {
  this.carritoService.agregarProducto(producto);
  this.mensajeToast = null;
  setTimeout(() => {
    this.mensajeToast = '✅ Producto agregado al carrito';
  }, 0);
}


}
