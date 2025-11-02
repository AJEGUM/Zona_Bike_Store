import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';

export interface Usuario {
  nombre: string;
  email: string;
  clave: string;
  id_rol: number;
}


@Injectable({
  providedIn: 'root',
})
export class Usuarios {
  
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private usuarioCreadoSource = new Subject<any>();
  usuarioCreado$ = this.usuarioCreadoSource.asObservable();

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  crearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  emitirUsuario(usuario: any) {
    this.usuarioCreadoSource.next(usuario);
  }
}
