import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, Footer],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {

}
