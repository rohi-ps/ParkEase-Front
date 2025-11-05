// user-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav';
import { DashboardUser } from '../dashboard-user/dashboard-user';
import { ParkingSlotsUser } from '../parking-slots-user/parking-slots-user';
import { Reservation } from '../reservation/reservation';
import { Billing } from '../billing/billing';
import { AuthGuard } from '../route-guards';

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardUser },
      { path: 'userdashboard', component: DashboardUser },
      { path: 'userparking', component: ParkingSlotsUser },
      { path: 'userreservation', component: Reservation },
      { path: 'billing', component: Billing }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
