import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Carrito } from '../../services/carrito/carrito';
import { UsuariosService } from '../../services/usuarios/usuarios';
import { AuthService } from '../../services/AuthService/auth-service';
import { Recuperacion } from '../../services/recuperacion/recuperacion';
import Swal from 'sweetalert2';

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

  modalRecuperarOpen = false;
  pasoRecuperacion = 1;

  emailRecuperacion = '';
  codigoIngresado = '';
  nuevaClave = '';

  emailGuardado = ''; // Para el flujo completo
  cargando: boolean = false;


  formLogin!: FormGroup;
  formRegistro!: FormGroup;


  @Input() mensajeExterno: string | null = null;
  @Output() searchChanged = new EventEmitter<string>();

  constructor(
    public carritoService: Carrito,
    private usuarioServices: UsuariosService,
    private AuthService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private recuperacionService: Recuperacion
  ) {

    this.formLogin = this.fb.group({
      email: ['', this.validaciones.email],
      clave: ['', [Validators.required]]
    });

    this.formRegistro = this.fb.group({
      nombre: ['', this.validaciones.nombre],
      correo: ['', this.validaciones.email],
      clave: ['', this.validaciones.clave]
    });
  }


  validaciones = {
    nombre: [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)],
    email: [Validators.required, Validators.pattern(/^[\w\.-]+@[\w\.-]+\.\w{2,4}$/)],
    clave: [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]
  };

  get control() {
    return this.isLogin ? this.formLogin.controls : this.formRegistro.controls;
  }

  get controlEmail() {
    return this.isLogin
      ? this.formLogin.get('email')
      : this.formRegistro.get('correo');
  }

  // Funcion general para validar
  validarInput(event: KeyboardEvent, tipo: string) {
    const char = event.key;

    const patrones: any = {
      letras: /^[a-zA-ZÀ-ÿ\s]$/,                       // solo letras y espacios
      numeros: /^[0-9]$/,                              // solo números
      alfanumerico: /^[a-zA-Z0-9À-ÿ\s]$/,              // letras + números
      email: /^[a-zA-Z0-9@._-]$/,                      // caracteres permitidos en email
      busqueda: /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]$/,          // para tu buscador
    };

    const patron = patrones[tipo];

    if (patron && !patron.test(char)) {
      event.preventDefault(); // si no coincide → bloquear
    }
  }

  soloLetras(event: KeyboardEvent) {
  const char = event.key;

  // Letras, espacio y acentos permitidos
  const regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]$/;

  if (!regex.test(char)) {
    event.preventDefault(); // Bloquea el carácter
  }
}


  ngOnInit() {
    this.carritoService.carrito$.subscribe((productos) => {
      this.carrito = productos;
      this.totalFormateado = this.carritoService.obtenerTotalFormateado();
    });

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
    this.formLogin.reset();
    this.formRegistro.reset();
  }

  mostrarCarga(mensaje: string = "Procesando...") {
    Swal.fire({
      title: mensaje,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  cerrarCarga() {
    Swal.close();
  }


  abrirModalRecuperar() {
    this.modalRecuperarOpen = true;
    this.pasoRecuperacion = 1;
    this.emailRecuperacion = '';
    this.codigoIngresado = '';
    this.nuevaClave = '';
  }

  cerrarModalRecuperacion() {
    this.modalRecuperarOpen = false;
  }


  enviarCodigo() {
    if (!this.emailRecuperacion || !/^[\w.-]+@[\w.-]+\.\w{2,4}$/.test(this.emailRecuperacion)) {
      this.mostrarAlerta("Correo inválido");
      return;
    }

    this.mostrarCarga("Enviando código...");

    this.recuperacionService.enviarCodigo(this.emailRecuperacion).subscribe({
      next: () => {
        this.cerrarCarga();
        this.emailGuardado = this.emailRecuperacion;
        this.pasoRecuperacion = 2;
        this.mostrarAlerta("Código enviado a tu correo y teléfono registrado");        
      },
      error: () => {
        this.cerrarCarga();
        this.mostrarAlerta("No se pudo enviar el código");
      }
    });
  }

  validarCodigo() {
    if (!this.codigoIngresado) {
      this.mostrarAlerta("Ingresa el código");
      return;
    }

    this.mostrarCarga("Validando código...");

    this.recuperacionService.validarCodigo(this.emailGuardado, this.codigoIngresado)
      .subscribe({
        next: () => {
          this.cerrarCarga();
          this.pasoRecuperacion = 3;
          this.mostrarAlerta("Código validado");
        },
        error: () => {
          this.cerrarCarga();
          this.mostrarAlerta("Código incorrecto");
        }
      });
  }

  guardarNuevaClave() {
    if (!this.nuevaClave || this.nuevaClave.length < 6) {
      this.mostrarAlerta("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    this.mostrarCarga("Guardando contraseña...");

    this.recuperacionService.cambiarPassword(this.emailGuardado, this.nuevaClave)
      .subscribe({
        next: () => {
          this.cerrarCarga();
          this.mostrarAlerta("Contraseña actualizada");
          this.cerrarModalRecuperacion();
        },
        error: () => {
          this.cerrarCarga();
          this.mostrarAlerta("Error al actualizar la contraseña");
        }
      });
  }


  toggleForm() {
    this.isLogin = !this.isLogin;
    this.formLogin.reset();
    this.formRegistro.reset();
  }

login() {
  if (this.formLogin.invalid) {
    this.formLogin.markAllAsTouched();
    this.mostrarAlerta('Revisa tus campos');
    return;
  }

  const { email, clave } = this.formLogin.value;

  this.AuthService.iniciarSesion(email, clave).subscribe({
    next: (resp: any) => {
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
  if (this.formRegistro.invalid) {
    this.formRegistro.markAllAsTouched();
    return;
  }

  const payload = {
    nombre: this.formRegistro.value.nombre,
    email: this.formRegistro.value.correo,
    clave: this.formRegistro.value.clave,
    id_rol: 2
  };

  this.usuarioServices.crearUsuario(payload).subscribe({
    next: () => {
      this.mostrarAlerta('Usuario registrado correctamente');
      this.cerrarModal();
    },
    error: () => {
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
    if (!item.imagen) return 'assets/placeholder-producto.png';

    // Si ya viene completa con "data:image"
    if (item.imagen.startsWith('data:image')) {
      return item.imagen;
    }

    // Si viene solo el base64 crudo (ej: /9j/..)
    return 'data:image/jpeg;base64,' + item.imagen;
  }

}
