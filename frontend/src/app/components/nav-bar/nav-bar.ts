import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Carrito } from '../../services/carrito/carrito';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nav-bar.html',
})
export class NavBar implements OnChanges {
  toastVisible = false;
  toastMessage = '';
  menuOpen = false;
  searchTerm = '';
  carritoOpen = false;

  carrito: any[] = [];
  totalFormateado = '';

  modalOpen = false;
  isLogin = true;
  nombre = '';
  email = '';
  password = '';

  @Input() mensajeExterno: string | null = null;
  @Output() searchChanged = new EventEmitter<string>();

  constructor(public carritoService: Carrito) {
    this.carritoService.carrito$.subscribe(items => {
      this.carrito = items;
      this.totalFormateado = this.carritoService.obtenerTotalFormateado();
    });
  }


  // 👇 Esta función detecta cuando cambia el mensaje desde el padre
  ngOnChanges(changes: SimpleChanges) {
    if (changes['mensajeExterno'] && this.mensajeExterno) {
      this.mostrarAlerta(this.mensajeExterno);
    }
  }

  mostrarAlerta(mensaje: string) {
    this.toastMessage = mensaje;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 1000);
  }

  abrirmenu() { this.menuOpen = !this.menuOpen; }
  cerrarmenu() { this.menuOpen = false; }
  onSearchChange() { this.searchChanged.emit(this.searchTerm); }

  abrirModal() { this.modalOpen = true; }
  abrirModalDesdeMenu() { this.cerrarmenu(); setTimeout(() => this.abrirModal(), 200); }
  cerrarModal() {
    this.modalOpen = false;
    this.isLogin = true;
    this.nombre = this.email = this.password = '';
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.nombre = this.email = this.password = '';
  }

  login() {
    if (this.email && this.password) {
      console.log('Login:', { email: this.email, password: this.password });
      this.cerrarModal();
    }
  }

  register() {
    if (this.nombre && this.email && this.password) {
      console.log('Registro:', { nombre: this.nombre, email: this.email, password: this.password });
      this.cerrarModal();
    }
  }

  abrirCarrito() {
    this.carritoOpen = true;
    document.body.style.overflow = 'hidden'; // 🚫 Desactiva el scroll del fondo
  }
  cerrarCarrito() {
    this.carritoOpen = false;
    document.body.style.overflow = ''; // ✅ Restaura el scroll normal
  }

  eliminarDelCarrito(id_producto: number) {
    this.carritoService.eliminarProducto(id_producto);
    this.totalFormateado = this.carritoService.obtenerTotalFormateado();
  }


  actualizarCantidad(id_producto: number, nuevaCantidad: number) {
    const cantidadNum = Number(nuevaCantidad);
    if (cantidadNum > 0) {
      this.carritoService.actualizarCantidad(id_producto, cantidadNum);
      this.totalFormateado = this.carritoService.obtenerTotalFormateado();
    }
  }


  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
    this.totalFormateado = this.carritoService.obtenerTotalFormateado();
  }


  obtenerImagen(item: any): string {
    if (item.imagen && item.imagen.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${item.imagen}`;
    }
    if (item.imagen && (item.imagen.startsWith('http') || item.imagen.startsWith('assets/'))) {
      return item.imagen;
    }
    return 'assets/placeholder-producto.png';
  }
}
