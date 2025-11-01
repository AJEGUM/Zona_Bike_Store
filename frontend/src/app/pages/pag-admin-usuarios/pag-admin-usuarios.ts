import { Component } from '@angular/core';
import { Usuarios } from '../../services/usuarios/usuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pag-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pag-admin-usuarios.html',
  styles: ``,
})
export class PagAdminUsuarios {

  usuarios: any[] = [];
  cargando = true;

  constructor(private usuariosService: Usuarios) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;

    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: () => {
        console.error('Error al obtener usuarios');
        this.cargando = false;
      }
    });
  }

}
