import { Component } from '@angular/core';
import { Promociones } from '../../services/promociones/promociones';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/AuthService/auth-service';

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
    alert("No puedes guardar la promoción hasta que subas una imagen con las dimensiones mínimas.");
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
    imagen: this.imagenBase64 ? this.imagenBase64.split(',')[1] : this.promoEditando?.imagen ?? null
  };

  const accion = this.promoEditando 
    ? this.promoService.actualizarPromocion(this.promoEditando.id_promocion, payload)
    : this.promoService.crearPromocion(payload);

  accion.subscribe((res: any) => {
    const id = this.promoEditando ? this.promoEditando.id_promocion : res.promocion.id_promocion;

    if (this.imagenBase64) {
      const base64Data = this.imagenBase64.split(',')[1]; 
      this.promoService.subirImagen(id, base64Data).subscribe(() => this.cargar());
    } else {
      this.cargar();
    }

    this.cerrarModal();
  });
}


  eliminar(id: number) {
    if (confirm('¿Seguro que quieres eliminar esta promoción?')) {
      this.promoService.eliminarPromocion(id).subscribe(() => {
        this.promociones = this.promociones.filter(p => p.id_promocion !== id);
      });
    }
  }


imagenSeleccionada(evento: any) {
  console.log("SE EJECUTO");

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
        alert(`La imagen es muy pequeña. Debe medir mínimo ${anchoMinimo} x ${altoMinimo}px.`);

        this.imagenInvalida = true;
        evento.target.value = "";
        this.imagenBase64 = null;
        this.form.imagen = null;

        return;
      }

      // IMAGEN VÁLIDA
      this.imagenBase64 = e.target.result; // esto sí se muestra en el preview
      this.form.imagen = this.imagenBase64; // se guarda para enviar al backend
    };
  };

  lector.readAsDataURL(archivo);
}



}
