import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Usuarios } from '../../services/usuarios/usuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-usuario.html',
  styles: ``,
})
export class ModalUsuario implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() usuarioCreado = new EventEmitter<any>();

  form!: FormGroup;
  roles: any[] = [];
  cargando = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private usuariosService: Usuarios) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      clave: ['', Validators.required],
    });

    this.cargarRoles();
  }

  cargarRoles() {
    this.usuariosService.obtenerRoles().subscribe({
      next: (res) => this.roles = res,
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  guardar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.cargando = true;

  const usuario = {
    nombre: this.form.value.nombre,
    email: this.form.value.correo,
    clave: this.form.value.clave,
    id_rol: Number(this.form.value.rol),
  };

  this.usuariosService.crearUsuario(usuario).subscribe({
    next: (res) => {
      this.cargando = false;
      this.usuariosService.emitirUsuario(res); // 🔥 emite globalmente
      this.cerrar.emit();
    },
    error: (err) => {
      this.cargando = false;
      this.errorMsg = err?.error?.error || 'Error al crear usuario';
    }
  });
}
}
