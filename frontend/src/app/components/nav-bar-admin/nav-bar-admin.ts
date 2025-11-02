import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalUsuario } from '../modal-usuario/modal-usuario';

@Component({
  selector: 'app-nav-bar-admin',
  standalone: true,
  imports: [RouterModule, Footer, CommonModule, ModalUsuario],
  templateUrl: './nav-bar-admin.html',
  styles: ``,
})
export class NavBarAdmin {
 titulo = 'Panel de Administración';
  modalAbierto = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.actualizarTitulo());
  }

  actualizarTitulo() {
    const ruta = this.router.url;
    if (ruta.includes('productos')) this.titulo = 'Gestión de productos';
    else if (ruta.includes('usuarios')) this.titulo = 'Gestión de usuarios';
    else if (ruta.includes('promociones')) this.titulo = 'Gestión de promociones';
    else if (ruta.includes('reportes')) this.titulo = 'Reportes y estadísticas';
    else this.titulo = 'Panel de Administración';
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  obtenerTituloModal() {
    return `Nuevo ${this.titulo.split(' ')[2] || 'registro'}`;
  }

  onUsuarioCreado(usuario: any) {
    console.log('Usuario creado:', usuario);
    // aquí puedes refrescar la lista de usuarios si quieres
  }
}
