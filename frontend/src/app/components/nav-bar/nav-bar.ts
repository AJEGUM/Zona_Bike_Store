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

  usuarioLogueado = '';
  rolUsuario = '';

  @Input() mensajeExterno: string | null = null;
  @Output() searchChanged = new EventEmitter<string>();

  constructor(public carritoService: Carrito, private usuarioServices: UsuariosService, private AuthService: AuthService, private router: Router) {
    this.carritoService.carrito$.subscribe(items => {
      this.carrito = items;
      this.totalFormateado = this.carritoService.obtenerTotalFormateado();
    });
  }

  ngOnInit() {
    const payload = this.AuthService.decodificarToken();
    if (payload) {
      this.usuarioLogueado = payload.nombre;
      this.rolUsuario = payload.rol;
    }
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

  this.AuthService.iniciarSesion(this.email, this.clave).subscribe({
    next: (resp: any) => {

      localStorage.setItem('token', resp.token);
      this.AuthService.guardarToken(resp.token);

      const payload = this.AuthService.decodificarToken();
      this.usuarioLogueado = payload?.nombre || '';
      this.rolUsuario = payload?.rol || '';

      if (this.rolUsuario === "Administrador") {
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

loginGoogle() {
  window.location.href = "http://localhost:3000/api/auth/google";
}


logout() {
  this.AuthService.cerrarSesion();
  this.usuarioLogueado = '';
  this.rolUsuario = '';
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
          this.mostrarAlerta('Usuario registrado correctamente');
          this.cerrarModal();
        },
        error: (err) => {
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

  // Buscar el item dentro del carrito actual
  const item = this.carrito.find(p => p.id_producto === id_producto);
  if (!item) return;

  // 🔴 Si intenta bajar de 1 → corregimos a 1
  if (cantidadNum < 1) {
    item.cantidad = 1;
    this.carritoService.actualizarCantidad(id_producto, 1);
  }

  // 🔴 Validación: si intenta superar el stock disponible
  else if (cantidadNum > item.stock) {
    item.cantidad = item.stock;
    this.carritoService.actualizarCantidad(id_producto, item.stock);

    this.mostrarAlerta("⛔ No hay suficiente stock disponible");
  }

  // ✔ Cantidad válida
  else {
    item.cantidad = cantidadNum;
    this.carritoService.actualizarCantidad(id_producto, cantidadNum);
  }

  this.totalFormateado = this.carritoService.obtenerTotalFormateado();
}



  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
    this.totalFormateado = this.carritoService.obtenerTotalFormateado();
  }

procederAlPago() {
  const payload = this.AuthService.decodificarToken(); // 👈 Verificar si hay usuario

  if (!payload) {
    this.cerrarCarrito();
    this.mostrarAlerta("Debes iniciar sesión para continuar");
    
    // 👇 Abre el modal de login
    setTimeout(() => this.abrirModal(), 300);
    return;
  }

  // ✔ Si está logueado, genera los datos para la pasarela
  const productosParaPagar = this.carrito.map(item => ({
    id_producto: item.id_producto,
    nombre: item.nombre,
    cantidad: item.cantidad,
    precio_unitario: item.precio_venta,
    subtotal: item.cantidad * item.precio_venta
  }));

  const total = productosParaPagar.reduce((sum, p) => sum + p.subtotal, 0);

  this.router.navigate(['/pago'], {
    queryParams: {
      productos: JSON.stringify(productosParaPagar),
      total: total
    }
  });

  this.cerrarCarrito();
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
