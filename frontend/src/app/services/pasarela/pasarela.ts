import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../AuthService/auth-service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Pasarela {
  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  crearOrden(data: any, idUsuario: number): Observable<any> {
    const token = this.auth.obtenerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Agregamos idUsuario al payload
    const body = { ...data, idUsuario };

    return this.http.post(`${this.apiUrl}/crear-orden`, body, { headers });
  }

}
