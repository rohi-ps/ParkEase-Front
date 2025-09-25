import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';

export const routes: Routes = [
    {
        path: '',
        component: Homepage
    },
    {
        path: 'user-dashboard',
        loadComponent: () => import('./dashboard-user/dashboard-user').then(m => m.DashboardUser)
    },
    {
        path: 'admin-dashboard',
        loadComponent: () => import('./dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin)
    }
];
