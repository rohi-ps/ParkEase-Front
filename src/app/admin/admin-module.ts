import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavAdmin } from '../sidenav-admin/sidenav-admin';
import { DashboardComponent } from '../dashboard-admin/dashboard-admin';
import { ParkingSlots } from '../parking-slots/parking-slots';
import { VehicleLogs } from '../vehicle-logs/vehicle-logs';
import { AdminReservations } from '../admin-reservations/admin-reservations';
import { Billing } from '../billing/billing';
import { authGuard,roleGuard } from '../Services/authGuards';
import { RateManagement } from '../rate-management/rate-management';
import { Homepage } from '../homepage/homepage';
const routes: Routes = [
  {
    path: '',
    component: SidenavAdmin,
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'admindashboard', component: DashboardComponent },
      { path: 'adminparking', component: ParkingSlots },
      { path: 'adminreservations', component: AdminReservations },
      { path: 'vehiclelogs', component: VehicleLogs },
      { path: 'billing', component: Billing },
      { path: 'rates', component: RateManagement },
       {path:"**",component:Homepage}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
