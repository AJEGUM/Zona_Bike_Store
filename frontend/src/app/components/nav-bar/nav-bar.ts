import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nav-bar.html',
})
export class NavBar {
  menuOpen: boolean = false;
  searchTerm: string = '';

  // Modal
  modalOpen: boolean = false;
  isLogin: boolean = true;

  nombre: string = '';
  email: string = '';
  password: string = '';

  @Output() searchChanged = new EventEmitter<string>();

  abrirmenu() {
    this.menuOpen = !this.menuOpen;
  }

  cerrarmenu() {
    this.menuOpen = false;
  }

  onSearchChange() {
    this.searchChanged.emit(this.searchTerm);
  }

  abrirModal() {
    this.modalOpen = true;
  }

  /** ✅ Abre el modal desde el menú móvil y cierra el menú */
  abrirModalDesdeMenu() {
    this.cerrarmenu();
    // Le damos un pequeño delay para que cierre el sidebar antes del modal
    setTimeout(() => {
      this.abrirModal();
    }, 200);
  }

  cerrarModal() {
    this.modalOpen = false;
    this.isLogin = true;
    this.nombre = '';
    this.email = '';
    this.password = '';
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.nombre = '';
    this.email = '';
    this.password = '';
  }

  login() {
    if (this.email && this.password) {
      console.log('Login:', { email: this.email, password: this.password });
      this.cerrarModal();
    }
  }

  register() {
    if (this.nombre && this.email && this.password) {
      console.log('Registro:', { nombre: this.nombre, email: this.email, password: this.password });
      this.cerrarModal();
    }
  }
}
