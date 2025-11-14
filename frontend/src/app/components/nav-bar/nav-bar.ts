import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Carrito } from '../../services/carrito/carrito';
import { UsuariosService } from '../../services/usuarios/usuarios';
import { AuthService } from '../../services/AuthService/auth-service';

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
  clave = '';

  @Input() mensajeExterno: string | null = null;
  @Output() searchChanged = new EventEmitter<string>();

  constructor(public carritoService: Carrito, private usuarioServices: UsuariosService, private AuthService: AuthService, private router: Router) {
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
    this.nombre = this.email = this.clave = '';
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.nombre = this.email = this.clave = '';
  }

login() {
  if (!this.email || !this.clave) return;
  console.log("📤 Enviando al backend:", this.email, this.clave);

  this.AuthService.iniciarSesion(this.email, this.clave).subscribe({
    next: (resp: any) => {
 console.log("🔥 Entró al next");
  console.log("🟢 Token recibido:", resp.token);

  // Forzar guardado
  localStorage.setItem('token', resp.token);

  console.log("📦 Token guardado en localStorage:", localStorage.getItem('token'));
      this.AuthService.guardarToken(resp.token);

      const rol = JSON.parse(atob(resp.token.split('.')[1])).rol;
      console.log("ROL DESDE TOKEN DIRECTO:", rol);
console.log(">>> NAVEGANDO A ADMIN...");

      if (rol === "Administrador") {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }

      this.mostrarAlerta('Inicio de sesión exitoso');
      this.cerrarModal();
    },
    error: () => {
      this.mostrarAlerta('Credenciales incorrectas');
    }
  });
}

  register() {
      if (!this.nombre || !this.email || !this.clave) return;

      const payload = {
        nombre: this.nombre,
        email: this.email,
        clave: this.clave,
        id_rol: 2
      };

      this.usuarioServices.crearUsuario(payload).subscribe({
        next: (resp: any) => {
          console.log('Usuario registrado:', resp);
          this.mostrarAlerta('Usuario registrado correctamente');
          this.cerrarModal();
        },
        error: (err) => {
          console.error(err);
          this.mostrarAlerta('Error al registrar');
        }
      });
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
