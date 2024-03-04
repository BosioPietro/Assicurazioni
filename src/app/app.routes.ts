import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registrazione',
    loadComponent: () => import('./registrazione/registrazione/registrazione.page').then( m => m.RegistrazionePage)
  },  {
    path: 'imposta-password',
    loadComponent: () => import('./imposta-password/imposta-password.page').then( m => m.ImpostaPasswordPage)
  }

];
