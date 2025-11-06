import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavAdmin } from '../sidenav-admin/sidenav-admin';
import { DashboardComponent } from '../dashboard-admin/dashboard-admin';
import { ParkingSlots } from '../parking-slots/parking-slots';
import { VehicleLogs } from '../vehicle-logs/vehicle-logs';
import { AdminReservations } from '../admin-reservations/admin-reservations';
import { Billing } from '../billing/billing';
import { AuthGuard } from '../route-guards';

const routes: Routes = [
  {
    path: '',
    component: SidenavAdmin,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'admindashboard', component: DashboardComponent },
      { path: 'adminparking', component: ParkingSlots },
      { path: 'adminreservation', component: AdminReservations },
      { path: 'vehiclelogs', component: VehicleLogs },
      { path: 'billing', component: Billing }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
