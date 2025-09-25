import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from './stat-card.component/stat-card.component';
import { ParkingStats } from "./parking-stats/parking-stats";
import { Stat } from '../model/dashboard-user-model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, StatCardComponent, ParkingStats],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardComponent implements OnInit {
  stats: Stat[] = [];
  data = 20;
  ngOnInit(): void {
    this.stats = [
      {
        title: 'Total Parking Slots',
        value: 150,
        iconClass: 'far fa-square', 
        iconColor: '#007bff' 
      },
      {
        title: 'Occupied Slots',
        value: 89,
        iconClass: 'fas fa-truck-moving', 
        iconColor: '#dc3545' 
      },
      {
        title: 'Available Slots',
        value: 61,
        iconClass: 'fas fa-check-circle', 
        iconColor: '#28a745' 
      },
      {
        title: 'Today\'s Revenue',
        // Value is kept as a string to match the '$1,240' format
        value: '$1,240', 
        iconClass: 'fas fa-dollar-sign', 
        iconColor: '#007bff', 
        isCurrency: true
      },
      {
        title: 'Active Users',
        value: 324,
        iconClass: 'fas fa-users', 
        iconColor: '#6f42c1' 
      },
      {
        title: 'Reserved Slots',
        value: 23,
        iconClass: 'fas fa-calendar-alt', 
        iconColor: '#fd7e14' 
      },
    ];
  }
}