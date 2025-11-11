import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav';
import { DashboardUser } from '../dashboard-user/dashboard-user';
import { ParkingSlotsUser } from '../parking-slots-user/parking-slots-user';
import { Reservation } from '../reservation/reservation';
import { Billing } from '../billing/billing';
import { authGuard, roleGuard } from '../Services/authGuards';
import { SlotReservationForm } from '../reservation/slot-reservation-form/slot-reservation-form';
import { Homepage } from '../homepage/homepage';
const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    canActivate: [authGuard,roleGuard],
    children: [
      { path: '', component: DashboardUser },
      { path: 'userdashboard', component: DashboardUser },
      { path: 'userparking', component: ParkingSlotsUser },
      { path: 'userreservation', component: Reservation },
      {path: 'userreservation/reserveform/:slotName', component: SlotReservationForm},
      { path: 'billing', component: Billing },
       {path:"**",component:Homepage}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
