import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { UserComponent } from './user-component/user-component';
import { AdminComponent } from './admin-component/admin-component';
import { AuthGuard } from './Services/auth.guard';


export const routes: Routes = [
    {
        path: '',
        component: Homepage
    },
    {
        path: 'user-dashboard',
        component: UserComponent,
        data: { roles: ['user'] }
    },
    {
        path: 'admin-dashboard',
        component: AdminComponent,
        data: { roles: ['admin'] }
    }
];
