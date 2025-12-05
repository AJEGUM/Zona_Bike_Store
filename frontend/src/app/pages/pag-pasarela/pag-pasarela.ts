import { Component } from '@angular/core';
import { Pasarela } from '../../services/pasarela/pasarela';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-pag-pasarela',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pag-pasarela.html',
})
export class PagPasarela {

  productos: any[] = [];
  total: number = 0;
  cargando = false;

  // Modelo para los datos de pago
  pago = {
    numero_tarjeta: '',
    fecha_expiracion: '',
    cvv: '',
    ciudad: '',
    pais: ''
  };

  formPago!: FormGroup;

  validaciones = {
    numero_tarjeta: [Validators.required, Validators.pattern(/^[0-9]{16}$/)],
    fecha_expiracion: [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
    cvv: [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)],
    ciudad: [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/)],
    pais: [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/)]
  };

  constructor(
    private fb: FormBuilder,
    private pasarelaService: Pasarela,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.formPago = this.fb.group({
      numero_tarjeta: ['', this.validaciones.numero_tarjeta],
      fecha_expiracion: ['', this.validaciones.fecha_expiracion],
      cvv: ['', this.validaciones.cvv],
      ciudad: ['', this.validaciones.ciudad],
      pais: ['', this.validaciones.pais]
    });
  }

  ngOnInit() {
    const productosStr = this.route.snapshot.queryParamMap.get('productos');
    const totalStr = this.route.snapshot.queryParamMap.get('total');

    if (productosStr) {
      this.productos = JSON.parse(productosStr);
    }

    if (totalStr) {
      this.total = Number(totalStr);
    }
  }

  // Validaciones tiempo real
  // Solo permite números
soloNumeros(event: KeyboardEvent) {
  const char = event.key;
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault();
  }
}

// Permite números y "/"
soloNumerosConSlash(event: KeyboardEvent) {
  const char = event.key;
  if (!/^[0-9\/]$/.test(char)) {
    event.preventDefault();
  }
}

// Solo permite letras y espacios
soloLetras(event: KeyboardEvent) {
  const char = event.key;
  if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]$/.test(char)) {
    event.preventDefault();
  }
}

autoFormatoFechaExpiracion(event: Event) {
  const input = event.target as HTMLInputElement;
  let valor = input.value;

  // Quitamos todo lo que no sea número
  valor = valor.replace(/\D/g, '');

  // Limitamos a 4 dígitos
  if (valor.length > 4) {
    valor = valor.slice(0, 4);
  }

  // Formateamos automáticamente como MM/AA
  if (valor.length >= 3) {
    valor = valor.slice(0, 2) + '/' + valor.slice(2);
  }

  // Actualizamos el FormControl sin disparar otro evento
  this.formPago.get('fecha_expiracion')?.setValue(valor, { emitEvent: false });
}


pagar() {
  // Validar el formulario
  if (this.formPago.invalid) {
    this.formPago.markAllAsTouched();
    Swal.fire({
      icon: 'error',
      title: 'Campos inválidos',
      text: 'Revisa que todos los datos de pago estén correctamente diligenciados.',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  // Obtener id_usuario desde token
  const idUsuario = this.auth.obtenerIdUsuario();
  if (!idUsuario) {
    Swal.fire({
      icon: 'error',
      title: 'No autorizado',
      text: 'Debes iniciar sesión para realizar el pago.',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  this.cargando = true;

  const pago = {
    ...this.formPago.value,
    fecha_expiracion: this.formPago.value.fecha_expiracion.replace('/', '')
  };

  const orden = {
    total: this.total,
    items: this.productos.map(p => ({
      id_producto: p.id_producto,
      cantidad: p.cantidad,
      precio_unitario: p.precio_unitario,
      nombre_producto: p.nombre
    })),
    pago
  };

  // Enviar al backend con idUsuario
  this.pasarelaService.crearOrden(orden, idUsuario).subscribe({
    next: () => {
      this.cargando = false;
      Swal.fire({
        icon: 'success',
        title: 'Pago realizado correctamente',
        text: 'Tu compra fue procesada con éxito.',
        confirmButtonColor: '#4f46e5'
      });
      this.router.navigate(['/']);
    },
    error: (err) => {
      this.cargando = false;
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar el pago',
        text: err.error?.mensaje || 'Ocurrió un error inesperado.',
        confirmButtonColor: '#ef4444'
      });
    }
  });
}




  regresar() {
    window.history.back();
  }

}
