import { Component } from '@angular/core';
import { Pasarela } from '../../services/pasarela/pasarela';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pag-pasarela',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(
    private pasarelaService: Pasarela,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  pagar() {
    this.cargando = true;

    const orden = {
      total: this.total,
      items: this.productos.map(p => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
        nombre_producto: p.nombre
      })),
      pago: this.pago // INCORPORACIÓN DEL PAGO
    };

    this.pasarelaService.crearOrden(orden).subscribe({
      next: (res) => {
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
