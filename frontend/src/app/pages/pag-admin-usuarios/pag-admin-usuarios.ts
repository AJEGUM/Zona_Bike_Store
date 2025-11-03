import { Component } from '@angular/core';
import { UsuariosService, Usuario } from '../../services/usuarios/usuarios';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pag-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pag-admin-usuarios.html',
})
export class PagAdminUsuarios {

  usuarios: Usuario[] = [];
  roles: any[] = [];

  cargando = true;
  modalAbierto = false;
  editando: Usuario | null = null;

  form: Usuario = {
    nombre: '',
    email: '',
    clave: '',
    id_rol: 0
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
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

  cargarRoles() {
    this.usuariosService.obtenerRoles().subscribe(data => this.roles = data);
  }

  abrirModalCrear() {
    this.editando = null;

    this.form = {
      nombre: '',
      email: '',
      clave: '',
      id_rol: 0
    };

    this.modalAbierto = true;
  }

  abrirModalEditar(usuario: Usuario) {
    this.editando = usuario;

    this.form = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      clave: '',
      id_rol: this.roles.find(r => r.nombre === usuario.rol)?.id_rol
    };

    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    if (this.editando) {
      this.usuariosService.actualizarUsuario(this.editando.id_usuario!, this.form)
        .subscribe(() => {
          this.cargarUsuarios();
          this.cerrarModal();
        });

    } else {
      this.usuariosService.crearUsuario(this.form)
        .subscribe(() => {
          this.cargarUsuarios();
          this.cerrarModal();
        });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.usuariosService.eliminarUsuario(id).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id_usuario !== id);
      });
    }
  }
}
