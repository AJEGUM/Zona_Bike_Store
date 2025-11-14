import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   constructor(private http: HttpClient, private router:Router) {}

  iniciarSesion(email: string, clave: string) {
      console.log("🔍 AuthService → datos enviados:", { email, clave }); // console A
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, clave });
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/']); // o ['/login']
  }

  decodificarToken(): any {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const partes = token.split('.');

      // Un token JWT válido siempre tiene 3 partes
      if (partes.length !== 3) {
        console.warn('Token inválido:', token);
        return null;
      }

      const payload = JSON.parse(atob(partes[1]));
      return payload;

    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  }


  obtenerRol() {
    return this.decodificarToken()?.rol;
  }

  obtenerNombre() {
    return this.decodificarToken()?.nombre;
  }

  obtenerIdUsuario() {
    return this.decodificarToken()?.id;
  }

  estaLogueado() {
    return !!this.obtenerToken();
  }
}
