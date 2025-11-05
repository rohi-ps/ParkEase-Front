import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Login } from './homepage/login/login';
import { Register } from './homepage/register/register';
export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'usersidenav',
    loadChildren: () => import('./user/user-routes.module').then(m => m.UserRoutingModule)
  },
  {
    path: 'adminsidenav',
    loadChildren: () => import('./admin/admin-routes.module').then(m => m.AdminModule)
  }
];

