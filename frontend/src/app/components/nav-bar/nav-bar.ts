import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css'],
})
export class NavBar {
  menuOpen: boolean = false;
  searchTerm: string = '';

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
}
