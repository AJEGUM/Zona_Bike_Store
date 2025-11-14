import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/AuthService/auth-service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.obtenerToken();

  if (!token) {
    router.navigate(['/']);
    return false;
  }

  const rol = auth.obtenerRol();

  // Ajusta según tu valor real del rol
  if (rol === "Administrador") {
    return true;
  }

  router.navigate(['/']);
  return false;
};
