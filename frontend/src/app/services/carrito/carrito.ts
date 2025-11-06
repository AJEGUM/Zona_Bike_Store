import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Carrito {
  private carrito = new BehaviorSubject<any[]>([]);
  carrito$ = this.carrito.asObservable();

  agregarProducto(producto: any) {
    const carritoActual = this.carrito.value;
    const existente = carritoActual.find(p => p.id_producto === producto.id_producto);

    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      carritoActual.push({ ...producto });
    }

    this.carrito.next([...carritoActual]);
  }


  eliminarProducto(id_producto: number) {
    const actualizado = this.carrito.value.filter(p => p.id_producto !== id_producto);
    this.carrito.next(actualizado);
  }

  vaciarCarrito() {
    this.carrito.next([]);
  }

  obtenerTotal(): number {
    return this.carrito.value.reduce(
      (acc, p) => acc + (p.precio_venta ?? 0) * (p.cantidad ?? 1),
      0
    );
  }

  obtenerTotalFormateado(): string {
    const total = this.obtenerTotal();
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(total);
  }

  formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  }

  actualizarCantidad(id_producto: number, nuevaCantidad: number) {
    const actual = this.carrito.value.map(p =>
      p.id_producto === id_producto
        ? { ...p, cantidad: nuevaCantidad, subtotal: p.precio_venta * nuevaCantidad }
        : p
    );

    this.carrito.next(actual);
    localStorage.setItem('carrito', JSON.stringify(actual));
  }
}
