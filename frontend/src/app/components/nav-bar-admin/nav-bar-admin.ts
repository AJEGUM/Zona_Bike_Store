import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalUsuario } from '../modal-usuario/modal-usuario';
import { ModalProducto } from '../modal-producto/modal-producto';

@Component({
  selector: 'app-nav-bar-admin',
  standalone: true,
  imports: [RouterModule, Footer, CommonModule, ModalUsuario, ModalProducto],
  templateUrl: './nav-bar-admin.html',
  styles: ``,
})
export class NavBarAdmin {
 titulo = 'Panel de Administración';
  modalTipo: 'usuario' | 'producto' | null = null;

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

  abrirModal(tipo: 'usuario' | 'producto') {
    this.modalTipo = tipo;
  }

  cerrarModal() {
    this.modalTipo = null;
  }

  obtenerTituloModal() {
    return `Nuevo ${this.titulo.split(' ')[2] || 'registro'}`;
  }

  UsuarioCreado(usuario: any) {
    console.log('Usuario creado:', usuario);
  }

  ProductoCreado(producto: any) {
    console.log('Producto creado:', producto);
  }

}
