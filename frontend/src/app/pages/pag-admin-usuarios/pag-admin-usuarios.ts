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
  modalAbierto = false;

  constructor(private usuariosService: Usuarios) {}

  ngOnInit() {
    this.cargarUsuarios();

    this.usuariosService.usuarioCreado$.subscribe(usuario => {this.usuarios = [...this.usuarios, usuario];});
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: () => this.cargando = false,
    });
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  agregarUsuarioALista(usuario: any) {
    // Crear un nuevo array para que Angular detecte el cambio
    this.usuarios = [...this.usuarios, usuario];
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.usuariosService.eliminarUsuario(id).subscribe({
        next: () => this.usuarios = this.usuarios.filter(u => u.id_usuario !== id),
      });
    }
  }
}
