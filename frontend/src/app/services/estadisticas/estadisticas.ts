import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Estadisticas {
  private apiUrl = `${environment.apiUrl}/estadisticas`;


  constructor(private http: HttpClient) {}

  obtenerProductosMasVendidos(limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos-mas-vendidos?limit=${limit}`);
  }

  obtenerVentasPorPeriodo(inicio: string, fin: string): Observable<any> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get(`${this.apiUrl}/ventas-por-periodo`, { params });
  }
}
