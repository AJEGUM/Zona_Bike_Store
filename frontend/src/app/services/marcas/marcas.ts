import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Marcas {
  private apiUrl = `${environment.apiUrl}/marcas`;

  constructor(private http: HttpClient) {}

  obtenerMarcas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  crearMarca(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarMarca(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarMarca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
