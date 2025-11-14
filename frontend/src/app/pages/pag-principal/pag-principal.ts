import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productosServices/productos-services';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Carrito } from '../../services/carrito/carrito';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pag-principal',
  standalone: true,
  imports: [CommonModule, NavBar, FormsModule, ReactiveFormsModule],
  templateUrl: './pag-principal.html',
})
export class PagPrincipal implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = []; 
  mensajeToast: string | null = null;
  modalProducto: any = null;
  modalAbierto = false;     
  cantidad = 1; 

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

  agregarAlCarrito(producto: any, cantidadInput?: number) {
    const cantidadSeleccionada = cantidadInput ?? 1; // si no se pasa, usa 1

    const item = {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio_venta: producto.precio_venta,
      precio_venta_formateado: producto.precio_venta_formateado,
      cantidad: cantidadSeleccionada,
      subtotal: producto.precio_venta * cantidadSeleccionada,
      imagen: producto.imagen,
    };

    this.carritoService.agregarProducto(item);
    this.mensajeToast = `🛒 Se agregaron ${cantidadSeleccionada} unidades de "${producto.nombre}" al carrito`;
    this.cerrarModalProducto();
  }


  abrirModalProducto(producto: any) {
    this.modalProducto = producto;
    this.cantidad = 1;
    this.modalAbierto = true;

    // Desactivar scroll sin salto
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  }

  cerrarModalProducto() {
    this.modalAbierto = false;
    this.modalProducto = null;

    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  disminuirCantidad() {
    this.cantidad = Math.max(1, this.cantidad - 1);
  }

  aumentarCantidad() {
    this.cantidad++;
  }

  mostrarToast() {
    const toast = document.createElement('div');
    toast.innerText = this.mensajeToast!;
    toast.className = 'fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
}
