import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Categorias {
  private apiUrl = `${environment.apiUrl}/categorias`;

    constructor(private http: HttpClient) {}

    obtenerCategorias(): Observable<any> {
      return this.http.get(this.apiUrl);
    }

    crearCategoria(data: any): Observable<any> {
      return this.http.post(this.apiUrl, data);
    }

    actualizarCategoria(id: number, data: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    eliminarCategoria(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
