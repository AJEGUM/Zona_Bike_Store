import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-nav-bar-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar-admin.html',
  styles: ``,
})
export class NavBarAdmin {

  nombre: string = '';
  rol: string = '';
  sidebar = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.nombre = this.authService.obtenerNombre();
    this.rol = this.authService.obtenerRol();
  }

  logout() {
    this.authService.cerrarSesion();
  }

}
