import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Producto {
  id_producto?: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  imagen: string;
  id_categoria: number;
  id_marca: number;
  estado?: string;

  categoria?: {
    id_categoria: number;
    nombre: string;
  };

  marca?: {
    id_marca: number;
    nombre: string;
  };

  stock?: number;

}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`);
  }

  obtenerMarcas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/marcas`);
  }

  subirImagenBase64(id: number, base64: string) {
    return this.http.post(`${environment.apiUrl}/imagenes/guardar/productos/id_producto/${id}`, {
      imagen: base64
    });
  }

  obtenerStock(id_producto: number): Observable<{ cantidad: number }> {
    return this.http.get<{ cantidad: number }>(`${this.apiUrl}/${id_producto}/stock`);
  }

  actualizarStock(id_producto: number, cantidad: number) {
    return this.http.put(`${this.apiUrl}/${id_producto}/stock`, { cantidad });
  }

}
