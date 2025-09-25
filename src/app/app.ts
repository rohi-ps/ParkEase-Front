import { Component} from '@angular/core';
import { ParkingSlots } from "./parking-slots/parking-slots";
import { SidenavComponent } from './sidenav/sidenav';
import { ParkingSlotsUser } from "./parking-slots-user/parking-slots-user";
import { DashboardUser } from './dashboard-user/dashboard-user';
import { Billing } from "./billing/billing";
import { VehicleLogs } from "./vehicle-logs/vehicle-logs";
import { Homepage } from "./homepage/homepage";

import { Reservation } from "./reservation/reservation";

import { CommonModule } from '@angular/common';
import { DashboardComponent } from "./dashboard-admin/dashboard-admin";


@Component({
  selector: 'app-root',
  imports: [Homepage, CommonModule, SidenavComponent, DashboardUser, ParkingSlotsUser, Reservation, VehicleLogs, Billing, DashboardComponent, ParkingSlots],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isSidenavOpen = true;
  isDisplay = "Dashboard";
  isId = "";
  // isLoggedIn = false;

  // onUserLoggedIn() {
  //   this.isLoggedIn = true;
  // }

  parkingEvent() {
    this.isDisplay = "Find Parking";
  }
  bookEvent(data : string){
    this.isDisplay = "Vehicle logs";
    this.isId = data;

  }
  reserveEvent(data : string){
    this.isDisplay = "My Reservation";
    this.isId = data;
  }

  onToggle(isOpen: boolean) {
    this.isSidenavOpen = isOpen;
  }

  onDisplayClicked(item : string){
    this.isDisplay = item;
  }

}
