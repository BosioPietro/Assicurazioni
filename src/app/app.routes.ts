import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login/reset-password',
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
        loadComponent: () => import("./login/login/form/login.component").then((m) => m.LoginComponent)
      },
      {
        path : "cambio-password",
        loadComponent: () => import("./login/form-cambio-password/cambio-password.component").then((m) => m.CambioPasswordComponent)
      },
      {
        path: "recupero-credenziali",
        loadComponent: () => import("./login/recupero-credenziali/form/recupero-credenziali.component").then((m) => m.RecuperoCredenzialiComponent)
      },
      {
        path: "reset-password",
        loadComponent: () => import("./login/reset-password/form/form-reset-password.component").then((m) => m.ResetPasswordComponent)
      }
    ]
  },
  {
    path: 'registrazione',
    loadComponent: () => import('./registrazione/registrazione.page').then( m => m.RegistrazionePage)
  }
];
