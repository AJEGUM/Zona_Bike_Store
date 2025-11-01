import { Routes } from '@angular/router';

export const routes: Routes = [

  // ✅ PANEL ADMIN (usa nav-bar-admin como layout)
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/nav-bar-admin/nav-bar-admin')
        .then(m => m.NavBarAdmin),
    children: [
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/pag-admin-productos/pag-admin-productos')
            .then(m => m.PagAdminProductos)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/pag-admin-usuarios/pag-admin-usuarios')
            .then(m => m.PagAdminUsuarios)
      },
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      }
    ]
  },

  // ✅ RUTAS PÚBLICAS (nav-bar normal)
  {
    path: '',
    loadComponent: () =>
      import('./components/nav-bar/nav-bar')
        .then(m => m.NavBar),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/pag-principal/pag-principal')
            .then(m => m.PagPrincipal)
      }
    ]
  }

];
