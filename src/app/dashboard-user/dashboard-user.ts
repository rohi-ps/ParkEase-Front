import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RecentActivity } from "./recent-activity/recent-activity";
import { Activity } from '../model/dashboard-user-model';
import { ParkingStatus } from "./parking-status/parking-status";
import { DashboardStats } from "./dashboard-stats/dashboard-stats";
import { SummaryCard } from "./summary-card/summary-card";
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-dashboard-user',
  imports: [RecentActivity, ParkingStatus, DashboardStats, SummaryCard,RouterOutlet],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css'
})
export class DashboardUser implements OnInit {


myActivityData: Activity[] = [];
data : number = 20;
  ngOnInit(): void {
    // You can add initialization logic here if needed
  }

  @Output() newParkingEvent = new EventEmitter<void>();

  createNewParking() {
    this.newParkingEvent.emit();
  }
  
  handleExtendParking() {
    alert('Parking extended!');
    // Implement actual extend parking logic here
  }

  handleEndParking() {
    alert('Parking ended!');
    // Implement actual end parking logic here
  }
}
