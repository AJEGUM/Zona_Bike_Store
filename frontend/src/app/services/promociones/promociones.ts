import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Promociones {
  private api = `${environment.apiUrl}/promociones`;

  constructor(private http: HttpClient) {}

  crearPromocion(data: any) {
    return this.http.post(`${this.api}`, data);
  }

  actualizarPromocion(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  listarPromociones() {
    return this.http.get(`${this.api}`);
  }

  subirImagen(id: number, base64: string) {
    return this.http.post(`${this.api}/imagen/${id}`, { imagen: base64 });
  }
}
