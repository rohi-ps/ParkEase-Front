import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RecentActivity } from "./recent-activity/recent-activity";
import { Activity } from '../model/dashboard-user-model';
import { ParkingStatus } from "./parking-status/parking-status";
import { DashboardStats } from "./dashboard-stats/dashboard-stats";
import { SummaryCard } from "./summary-card/summary-card";
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-user',
  imports: [RecentActivity, ParkingStatus, DashboardStats, SummaryCard, RouterOutlet, FormsModule],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css'
})

export class DashboardUser implements OnInit {
public username:string | undefined='';

constructor(private authService:AuthService){}

myActivityData: Activity[] = [];
data : number = 20;
  ngOnInit(): void {
    const currUser=this.authService.decodeToken();
    if(currUser){
      this.username=currUser.firstName;
    }
  }

  @Output() newParkingEvent = new EventEmitter<void>();


  
  handleExtendParking() {
    alert('Parking extended!');
    // Implement actual extend parking logic here
  }

  handleEndParking() {
    alert('Parking ended!');
    // Implement actual end parking logic here
  }
}
