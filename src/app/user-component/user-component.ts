import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Homepage } from "../homepage/homepage";
import { SidenavComponent } from '../sidenav/sidenav';
import { DashboardComponent } from "../dashboard-admin/dashboard-admin";
import { DashboardUser } from '../dashboard-user/dashboard-user';
import { ParkingSlots } from "../parking-slots/parking-slots";
import { ParkingSlotsUser } from "../parking-slots-user/parking-slots-user";
import { Reservation } from "../reservation/reservation";
import { VehicleLogs } from "../vehicle-logs/vehicle-logs";
import { Billing } from "../billing/billing";
import { AuthService } from "../Services/auth.service";
import { Router } from '@angular/router';
import { AdminComponent } from "../admin-component/admin-component";



@Component({
  selector: 'app-user-component',
  imports: [ParkingSlots, SidenavComponent, DashboardUser, ParkingSlotsUser, Reservation, VehicleLogs, Billing, Homepage, CommonModule, DashboardComponent, AdminComponent],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css'
})
export class UserComponent {
isSidenavOpen = true;
  isDisplay = "Dashboard";
  isId = "";
  userRole: string = '';
   constructor(
    private authService: AuthService,
    private router: Router
  ) {}
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
  ngOnInit() {
    this.userRole = this.authService.getCurrentUserRole();
    if (!this.userRole) {
      // If no user role is found, redirect to login
      this.router.navigate(['/']);
    }
  }


  isAdmin(): boolean {
    return this.userRole === 'admin';
  }
}
