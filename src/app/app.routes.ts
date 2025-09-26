import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { UserComponent } from './user-component/user-component';
import { AdminComponent } from './admin-component/admin-component';


export const routes: Routes = [
    {
        path: '',
        component: Homepage
    },
    {
        path: 'user-dashboard',
        component: UserComponent,
    },
    {
        path: 'admin-dashboard',
        component: AdminComponent,
    }
];
