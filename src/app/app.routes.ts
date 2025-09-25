import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Homepage
    },
    {
        path: 'user-dashboard',
        component: Dashboard
    },
    {
        path: 'admin-dashboard',
        component: Dashboard
    }
];
