import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

import { SidenavAdmin } from "../sidenav-admin/sidenav-admin";
import { ParkingSlots } from "../parking-slots/parking-slots";
import { AdminReservations } from "../admin-reservations/admin-reservations";
import { VehicleLogs } from "../vehicle-logs/vehicle-logs";
import { Billing } from "../billing/billing";
import { DashboardComponent } from "../dashboard-admin/dashboard-admin";

@Component({
  selector: 'app-admin-component',
  imports: [SidenavAdmin, ParkingSlots, AdminReservations, VehicleLogs, Billing, CommonModule, DashboardComponent],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css'
})
export class AdminComponent {
isSidenavOpen = true;
  isDisplay = "Dashboard";
  isId = "";

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
