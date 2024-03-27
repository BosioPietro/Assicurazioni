import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    children : [
      {
        path : "",
        loadComponent: () => import("./login/form-login/login.component").then((m) => m.LoginComponent)
      },
      {
        path : "cambio-password",
        loadComponent: () => import("./login/form-cambio-password/cambio-password.component").then((m) => m.CambioPasswordComponent)
      },
      {
        path: "recupero-credenziali",
        loadComponent: () => import("./login/form-recupero-credenziali/recupero-credenziali.component").then((m) => m.RecuperoCredenzialiComponent)
      }
    ]
  },
  {
    path: 'registrazione',
    loadComponent: () => import('./registrazione/registrazione.page').then( m => m.RegistrazionePage)
  }
];
