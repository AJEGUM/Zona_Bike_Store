import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, Footer, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  menuOpen: boolean = false;

  abrirmenu() {
    this.menuOpen = !this.menuOpen;
  }

  cerrarmenu() {
    this.menuOpen = false;
  }
}
