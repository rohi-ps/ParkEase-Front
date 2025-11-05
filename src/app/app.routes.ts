import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { SidenavComponent } from './sidenav/sidenav';
import { DashboardUser } from './dashboard-user/dashboard-user';
import { ParkingSlotsUser } from './parking-slots-user/parking-slots-user';
import { Reservation } from './reservation/reservation';
import { Billing } from './billing/billing';
import { SidenavAdmin } from './sidenav-admin/sidenav-admin';
import { DashboardComponent } from './dashboard-admin/dashboard-admin';
import { ParkingSlots } from './parking-slots/parking-slots';
import { VehicleLogs } from './vehicle-logs/vehicle-logs';
import { AdminReservations } from './admin-reservations/admin-reservations';
import { Login } from './homepage/login/login';
import { Register } from './homepage/register/register';

export const routes: Routes = [
  {path:'',component:Homepage},
  {path:'login',component:Login},
  {path:'register',component:Register},
  {path:'usersidenav',component:SidenavComponent,
    children:[
        {path:'',component:DashboardUser},
        {path:'userdashboard',component:DashboardUser},
        {path:'userparking',component:ParkingSlotsUser},
        {path:'userreservation',component:Reservation},
        {path:'billing',component:Billing},
        {path:'logout',component:Homepage}
    ]
  },
   {path:'adminsidenav',component:SidenavAdmin,
    children:[
        {path:'',component:DashboardComponent},
        {path:'admindashboard',component:DashboardComponent},
        {path:'adminparking',component:ParkingSlots},
        {path:'adminreservation',component:AdminReservations},
        {path:'vehiclelogs',component:VehicleLogs},
        {path:'billing',component:Billing}
    ]
  }
];
