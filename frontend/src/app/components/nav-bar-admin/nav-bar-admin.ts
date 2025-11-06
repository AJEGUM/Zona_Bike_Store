import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar-admin.html',
  styles: ``,
})
export class NavBarAdmin {

}
