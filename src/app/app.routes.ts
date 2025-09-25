import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { UserComponent } from './user-component/user-component';

export const routes: Routes = [
    {
        path: '',
        component: Homepage
    },
    {
        path: 'user-dashboard',
        component: UserComponent
    },
    {
        path: 'admin-dashboard',
        component: UserComponent
    }
];
