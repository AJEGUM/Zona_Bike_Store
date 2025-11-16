import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.html',
  styles: ``,
})
export class OauthCallback {
constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    const token = this.route.snapshot.queryParamMap.get("token");

    if (token) {
      this.auth.guardarToken(token);

      const rol = this.auth.obtenerRol();

      if (rol === "Administrador") {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
