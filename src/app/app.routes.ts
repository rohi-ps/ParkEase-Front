import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { SidenavComponent } from './sidenav/sidenav';
import { DashboardUser } from './dashboard-user/dashboard-user';
import { ParkingSlotsUser } from './parking-slots-user/parking-slots-user';
import { Reservation } from './reservation/reservation';
import { VehicleLogs } from './vehicle-logs/vehicle-logs';
import { Billing } from './billing/billing';

export const routes: Routes = [
   {path:'',component:Homepage},
   {path:'nav',component:SidenavComponent,
    children:[
        {path:'',component:DashboardUser},
        {path:'userdashboard',component:DashboardUser},
        {path:'parkingslot',component:ParkingSlotsUser},
        {path:'reservation',component:Reservation},
        {path:'vehiclelogs',component:VehicleLogs},
        {path:'billing',component:Billing}
    ]
   } ,
   {path:'/nav',component:SidenavComponent,
    children:[
        {path:'userdashboard',component:DashboardUser},
        {path:'parkingslot',component:ParkingSlotsUser},
        {path:'reservation',component:Reservation},
        {path:'vehiclelogs',component:VehicleLogs},
        {path:'billing',component:Billing}
    ]
   } 
];
