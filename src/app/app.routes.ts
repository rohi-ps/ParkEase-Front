import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Login } from './homepage/login/login';
import { Register } from './homepage/register/register';
import { authGuard,roleGuard } from './Services/authGuards';
export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'usersidenav',
    loadChildren: () => import('./user/user-module').then(m => m.UserRoutingModule),
    canActivate: [authGuard, roleGuard('user')]
  },
  {
    path: 'adminsidenav',
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminRoutingModule),
    canActivate: [authGuard, roleGuard('admin')]
  },
  {
    path:"**",
    component:Homepage
  }
];
