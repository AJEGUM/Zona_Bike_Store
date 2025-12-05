import { Component } from '@angular/core';
import { UsuariosService, Usuario } from '../../services/usuarios/usuarios';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  claveError: string = '';
  emailError: string = '';


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

  soloNumeros(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) event.preventDefault();
  }

  soloLetras(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]$/.test(char)) event.preventDefault();
  }

  soloLetrasNumeros(event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  soloPermitidos(event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9@._-]*$/; // ej. email
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  validarClave(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    // Regex: mínimo 8 caracteres, al menos 1 mayúscula, al menos 1 número
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!regex.test(valor)) {
      input.setCustomValidity('La clave debe tener al menos 8 caracteres, una letra mayúscula y un número');
    } else {
      input.setCustomValidity(''); // todo ok
    }
  }

  validarClaveVisual() {
    const valor = this.form.clave || '';

    // Regex: mínimo 8 caracteres, al menos 1 mayúscula, al menos 1 número
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!valor) {
      this.claveError = this.editando ? '' : 'La clave es requerida';
    } else if (!regex.test(valor)) {
      this.claveError = 'Debe tener mínimo 8 caracteres, una mayúscula y un número';
    } else {
      this.claveError = ''; // todo ok
    }
  }

  validarEmail() {
    const valor = this.form.email || '';

    // Regex simple para email con dominio (ejemplo: usuario@dominio.com)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!valor) {
      this.emailError = 'El email es requerido';
    } else if (!regex.test(valor)) {
      this.emailError = 'Ingrese un email válido con dominio';
    } else {
      this.emailError = ''; // todo correcto
    }
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

  // 🟢 EDITAR
  if (this.editando) {

    this.usuariosService.actualizarUsuario(this.editando.id_usuario!, this.form)
      .subscribe({
        next: () => {

          this.cargarUsuarios();
          this.cerrarModal();

          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el usuario',
            text: 'Intenta nuevamente.'
          });
        }
      });

    return;
  }

  // 🔵 CREAR
  this.usuariosService.crearUsuario(this.form)
    .subscribe({
      next: () => {

        this.cargarUsuarios();
        this.cerrarModal();

        Swal.fire({
          icon: 'success',
          title: 'Usuario creado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el usuario',
          text: 'Revisa los datos e intenta nuevamente.'
        });
      }
    });

}


eliminar(id: number) {

  Swal.fire({
    title: '¿Eliminar usuario?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {

      this.usuariosService.eliminarUsuario(id).subscribe({
        
        next: () => {

          this.usuarios = this.usuarios.filter(u => u.id_usuario !== id);

          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            timer: 1500,
            showConfirmButton: false
          });
        },

        error: (err) => {

          if (err.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar',
              text: err.error.mensaje || 'Este usuario está relacionado con otros registros.'
            });

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error en el servidor',
              text: 'No se pudo eliminar el usuario.'
            });
          }

        }

      });
    }

  });

}

}
