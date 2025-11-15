import { Component } from '@angular/core';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ProductosService } from '../../services/productosServices/productos-services';
import { Carrito } from '../../services/carrito/carrito';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pag-productos',
  standalone: true,
  imports: [NavBar, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pag-productos.html',
  styles: ``,
})
export class PagProductos {

  productos: any[] = [];
  productosFiltrados: any[] = [];

  // Filtros
  categorias: any[] = [];  
  categoriasSeleccionadas: number[] = [];
  precioMin: number = 0;
  precioMax: number = 25000000;
  soloDisponibles: boolean = false;
  terminoBusqueda: string = "";

  // Modal
  modalProducto: any = null;
  modalAbierto = false;
  cantidad: number = 1;
  modalFiltrosAbierto = false;

  // Toast
  mensajeToast: string | null = null;

  constructor(
    private productosService: ProductosService,
    private carritoService: Carrito
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  // ============================
  //       CARGAR DATOS
  // ============================

  cargarProductos() {
    this.productosService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  cargarCategorias() {
    this.productosService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data; // {id_categoria, nombre}
      },
      error: (err) => console.error("Error al cargar categorías:", err)
    });
  }

  // ============================
  //           IMAGEN
  // ============================

  obtenerImagen(prod: any) {
    if (!prod.imagen) return 'assets/no-image.png';
    if (!prod.imagen.startsWith('data:image')) {
      return 'data:image/jpeg;base64,' + prod.imagen;
    }
    return prod.imagen;
  }

  // ============================
  //     BUSQUEDA NAVBAR
  // ============================

  filtrarProductos(term: string) {
    this.terminoBusqueda = term;
    this.aplicarFiltros();
  }

  // ============================
  //          CARRITO
  // ============================

  agregarAlCarrito(producto: any, cantidadInput?: number) {
    const cantidadSeleccionada = cantidadInput ?? 1;

    const item = {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio_venta: producto.precio_venta,
      cantidad: cantidadSeleccionada,
      subtotal: producto.precio_venta * cantidadSeleccionada,
      imagen: producto.imagen
    };

    this.carritoService.agregarProducto(item);
    this.mensajeToast = `🛒 Se agregaron ${cantidadSeleccionada} unidades de "${producto.nombre}" al carrito`;
    this.cerrarModalProducto();
  }

  // ============================
  //           MODAL
  // ============================

  abrirModalProducto(producto: any) {
    this.modalProducto = producto;
    this.cantidad = 1;
    this.modalAbierto = true;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
  }

  cerrarModalProducto() {
    this.modalAbierto = false;
    this.modalProducto = null;

    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  disminuirCantidad() {
    this.cantidad = Math.max(1, this.cantidad - 1);
  }

  aumentarCantidad() {
    this.cantidad++;
  }

  // ============================
  //           TOAST
  // ============================

  mostrarToast() {
    const toast = document.createElement('div');
    toast.innerText = this.mensajeToast!;
    toast.className = 'fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // ============================
  //           FILTROS
  // ============================

  alternarCategoria(id_categoria: number) {
    if (this.categoriasSeleccionadas.includes(id_categoria)) {
      this.categoriasSeleccionadas =
        this.categoriasSeleccionadas.filter(c => c !== id_categoria);
    } else {
      this.categoriasSeleccionadas.push(id_categoria);
    }
    this.aplicarFiltros();
  }

  cambiarPrecio() {
    if (this.precioMin > this.precioMax) {
      this.precioMax = this.precioMin;
    }
    this.aplicarFiltros();
  }

  cambiarDisponibilidad() {
    this.soloDisponibles = !this.soloDisponibles;
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.categoriasSeleccionadas = [];
    this.precioMin = 0;
    this.precioMax = 25000000;
    this.soloDisponibles = false;
    this.terminoBusqueda = "";

    this.productosFiltrados = this.productos;
  }

  aplicarFiltros() {
    this.productosFiltrados = this.productos.filter(prod => {

      // Categoría
      const matchCategoria =
        this.categoriasSeleccionadas.length === 0 ||
        this.categoriasSeleccionadas.includes(prod.categoria?.id_categoria);

      // Precio
      const matchPrecio =
        prod.precio_venta >= this.precioMin &&
        prod.precio_venta <= this.precioMax;

      // Stock (si tu API usa prod.stock)
      const matchDisponibilidad =
        !this.soloDisponibles || prod.stock > 0;

      // Búsqueda
      const matchBusqueda =
        !this.terminoBusqueda ||
        prod.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      return matchCategoria && matchPrecio && matchDisponibilidad && matchBusqueda;
    });
  }

  contarFiltrosActivos(): number {
    let count = 0;

    if (this.categoriasSeleccionadas.length > 0) count++;
    if (this.precioMax !== 25000000) count++;
    if (this.soloDisponibles) count++;

    return count;
  }

}
