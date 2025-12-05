import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Recuperacion {
 private http = inject(HttpClient);

 private api = `${environment.apiUrl}/recuperacion`;

 enviarCodigo(email: string) {
   return this.http.post(`${this.api}/solicitar-codigo`, { email });
 }

 validarCodigo(email: string, codigo: string) {
   return this.http.post(`${this.api}/verificar-codigo`, { email, codigo });
 }

 cambiarPassword(email: string, nuevaClave: string) {
   return this.http.post(`${this.api}/restablecer-clave`, {
     email,
     nuevaClave
   });
 }
}
