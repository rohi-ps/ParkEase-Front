import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Login } from './homepage/login/login';
import { Register } from './homepage/register/register';
import { AuthGuard } from './route-guards';
export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'usersidenav',
    loadChildren: () => import('./user/user-module').then(m => m.UserRoutingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'adminsidenav',
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminRoutingModule),
    canActivate: [AuthGuard]
  }
];
