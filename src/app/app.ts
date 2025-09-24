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


@Component({
  selector: 'app-root',
  imports: [Homepage, Reservation, CommonModule, SidenavComponent, DashboardUser, ParkingSlotsUser, VehicleLogs, Billing, ParkingSlots],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isSidenavOpen = true;
  isDisplay = "Dashboard";
  // isLoggedIn = false;

  // onUserLoggedIn() {
  //   this.isLoggedIn = true;
  // }

  parkingEvent() {
    this.isDisplay = "Find Parking";
  }
  bookEvent(){
    this.isDisplay = "Vehicle logs";
  }
  reserveEvent(){
    this.isDisplay = "My Reservation";
  }

  onToggle(isOpen: boolean) {
    this.isSidenavOpen = isOpen;
  }

  onDisplayClicked(item : string){
    this.isDisplay = item;
  }

}
