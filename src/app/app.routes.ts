import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { DashboardUser } from './dashboard-user/dashboard-user';
import { DashboardAdmin } from './dashboard-admin/dashboard-admin';

export const routes: Routes = [
    {
        path: '',
        component: Homepage
    }
    ,{
        path: 'userdashboard',
        component: DashboardUser
    },
    {
        path:'admindashboard',
        component: DashboardAdmin
    }
    
];
