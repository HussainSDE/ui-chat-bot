import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat').then((m) => m.Chat),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
