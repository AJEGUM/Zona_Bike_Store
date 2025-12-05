import { Component } from '@angular/core';
import { Promociones } from '../../services/promociones/promociones';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/AuthService/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pag-admin-promociones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pag-admin-promociones.html',
  styles: ``,
})
export class PagAdminPromociones {

  promociones: any[] = [];
  modalAbierto: boolean = false;
  promoEditando: any = null;
  imagenInvalida: boolean = false;
  imagenBase64: string | null = null; // Solo se usa si el usuario carga nueva imagen

  // FORMULARIO
  form = {
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activa',
    imagen: null as string | null,
    posicion_texto: 'abajo'
  };

  id_usuario: number | null = null;

  constructor(
    private promoService: Promociones,
    private AuthService: AuthService
  ) {}

  ngOnInit() {
    this.id_usuario = this.AuthService.obtenerIdUsuario();
    this.cargar();
  }

  soloLetrasNumeros(event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  cargar() {
    this.promoService.listarPromociones().subscribe((data: any) => {
      this.promociones = data;
    });
  }

  abrirModalCrear() {
    this.modalAbierto = true;
    this.promoEditando = null;
    this.imagenBase64 = null;

    this.form = {
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'activa',
      imagen: null,
      posicion_texto: 'abajo'
    };
  }

  abrirModalEditar(promo: any) {
    this.modalAbierto = true;
    this.promoEditando = promo;

    this.form = {
      titulo: promo.titulo,
      descripcion: promo.descripcion,
      fecha_inicio: promo.fecha_inicio,
      fecha_fin: promo.fecha_fin,
      estado: promo.estado,
      imagen: promo.imagen ? `data:image/jpeg;base64,${promo.imagen}` : null,
      posicion_texto: promo.posicion_texto ?? 'abajo'
    };

    this.imagenBase64 = null; // si sube nueva imagen
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.promoEditando = null;
    this.imagenBase64 = null;
  }

guardar() {

  if (this.imagenInvalida) {
    Swal.fire({
      icon: 'warning',
      title: 'Imagen inválida',
      text: 'Debes subir una imagen con las dimensiones mínimas requeridas.'
    });
    return;
  }

  const payload = {
    titulo: this.form.titulo,
    descripcion: this.form.descripcion,
    fecha_inicio: this.form.fecha_inicio,
    fecha_fin: this.form.fecha_fin,
    estado: this.form.estado,
    posicion_texto: this.form.posicion_texto,
    id_usuario: this.id_usuario,
    imagen: this.imagenBase64
      ? this.imagenBase64.split(',')[1]
      : this.promoEditando?.imagen ?? null
  };

  const accion = this.promoEditando
    ? this.promoService.actualizarPromocion(this.promoEditando.id_promocion, payload)
    : this.promoService.crearPromocion(payload);

  accion.subscribe({
    next: (res: any) => {
      const id = this.promoEditando
        ? this.promoEditando.id_promocion
        : res.promocion.id_promocion;

      // Si hay nueva imagen
      if (this.imagenBase64) {
        const base64Data = this.imagenBase64.split(',')[1];

        this.promoService.subirImagen(id, base64Data).subscribe(() => {
          this.cargar();
          this.cerrarModal();

          Swal.fire({
            icon: 'success',
            title: this.promoEditando ? 'Promoción actualizada' : 'Promoción creada',
            timer: 1500,
            showConfirmButton: false
          });
        });

        return;
      }

      // Si no se cambió la imagen
      this.cargar();
      this.cerrarModal();

      Swal.fire({
        icon: 'success',
        title: this.promoEditando ? 'Promoción actualizada' : 'Promoción creada',
        timer: 1500,
        showConfirmButton: false
      });
    },

    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al guardar la promoción.'
      });
    }
  });

}

eliminar(id: number) {

  Swal.fire({
    title: '¿Eliminar promoción?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {

      this.promoService.eliminarPromocion(id).subscribe({
        next: () => {
          this.promociones = this.promociones.filter(p => p.id_promocion !== id);

          Swal.fire({
            icon: 'success',
            title: 'Promoción eliminada',
            timer: 1500,
            showConfirmButton: false
          });
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo eliminar',
            text: 'La promoción puede estar relacionada con otros datos.'
          });
        }
      });

    }

  });

}

imagenSeleccionada(evento: any) {

  const archivo = evento.target.files[0];
  this.imagenInvalida = false;

  if (!archivo) {
    this.imagenBase64 = null;
    this.form.imagen = null;
    return;
  }

  const lector = new FileReader();
  const imagen = new Image();

  lector.onload = (e: any) => {
    imagen.src = e.target.result;

    imagen.onload = () => {
      const anchoMinimo = 1200;
      const altoMinimo = 400;

      if (imagen.width < anchoMinimo || imagen.height < altoMinimo) {

        Swal.fire({
          icon: 'warning',
          title: 'Imagen demasiado pequeña',
          text: `Debe medir al menos ${anchoMinimo} x ${altoMinimo}px.`
        });

        this.imagenInvalida = true;
        evento.target.value = "";
        this.imagenBase64 = null;
        this.form.imagen = null;

        return;
      }

      // Imagen válida
      this.imagenBase64 = e.target.result;
      this.form.imagen = this.imagenBase64;
    };
  };

  lector.readAsDataURL(archivo);
}




}
