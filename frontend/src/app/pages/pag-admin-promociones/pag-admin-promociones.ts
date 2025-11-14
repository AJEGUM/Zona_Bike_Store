import { Component } from '@angular/core';
import { Promociones } from '../../services/promociones/promociones';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pag-admin-promociones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pag-admin-promociones.html',
  styles: ``,
})
export class PagAdminPromociones {
 promociones: any[] = [];
  form: any = {};
  imagenBase64: string | null = null;
  titulo: string = '';
  descripcion: string = '';
  fecha_inicio: string = '';
  fecha_fin: string = '';
  estado: string = 'activa';
  imagen: string | null = null;
  id_usuario: number | null = null;

  constructor(private promoService: Promociones) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.promoService.listarPromociones().subscribe((data: any) => {
      this.promociones = data;
    });
  }

  previewImg(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => this.imagenBase64 = reader.result as string;
    reader.readAsDataURL(file);
  }

  guardar() {
    const payload = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      fecha_inicio: this.fecha_inicio,
      fecha_fin: this.fecha_fin,
      estado: this.estado,
      imagen: this.imagen,
      id_usuario: this.id_usuario
    };

    this.promoService.crearPromocion(payload).subscribe({
      next: (res) => {
        console.log('Guardado!', res);

        this.titulo = '';
        this.descripcion = '';
        this.fecha_inicio = '';
        this.fecha_fin = '';
        this.estado = 'activa';
        this.imagen = null;

        // Si tienes un input file
        const fileInput = document.getElementById('imagen') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        console.error('Error al guardar', err);
      }
    });
  }
}
