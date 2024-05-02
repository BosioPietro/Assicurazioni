import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/home',
    pathMatch: 'full',
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
        loadComponent: () => import("./login/cambio-password/form/cambio-password.component").then((m) => m.CambioPasswordComponent)
      },
      {
        path: "recupero-credenziali",
        loadComponent: () => import("./login/recupero-credenziali/form/recupero-credenziali.component").then((m) => m.RecuperoCredenzialiComponent)
      },
      {
        path: "reset-password",
        loadComponent: () => import("./login/reset-password/form/form-reset-password.component").then((m) => m.ResetPasswordComponent)
      },
      {
        path: "verifica",
        loadComponent: () => import("./login/verifica/form/verifica.component").then((m) => m.VerificaComponent)
      }
    ]
  },
  {
    path: 'registrazione',
    loadComponent: () => import('./registrazione/registrazione.page').then( m => m.RegistrazionePage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then( m => m.AdminPage),
    children: [
      {
        path: 'utenti',
        loadComponent: () => import('./admin/utenti/utenti.page').then( m => m.UtentiPage)
      },
      {
        path: 'perizie',
        loadComponent: () => import('./admin/perizie/perizie.page').then( m => m.PeriziePage)
      },
      {
        path: 'perizie/:codice',
        loadComponent: () => import('./admin/perizia/perizia.page').then( m => m.PeriziaPage)
      },
      {
        path: 'perizia',
        pathMatch: 'full',
        redirectTo: 'perizie'
      },
      {
        path: 'home',
        loadComponent: () => import('./admin/home/home.page').then( m => m.HomePage)
      },
    ]
  },
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: 'admin/perizie',
  },
  {path: '**', redirectTo: 'admin/home'}
];
