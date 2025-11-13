import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RecentActivity } from "./recent-activity/recent-activity";
import { Activity } from '../model/dashboard-user-model';
import { ParkingStatus } from "./parking-status/parking-status";
import { DashboardStats } from "./dashboard-stats/dashboard-stats";
import { SummaryCard } from "./summary-card/summary-card";
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../Services/billing.service';
import { Invoice } from '../model/billing.model';
import { 
  calculateBillingTotals
} from '../utils/billing.utils';

@Component({
  selector: 'app-dashboard-user',
  imports: [RecentActivity, ParkingStatus, DashboardStats, SummaryCard, RouterOutlet, FormsModule],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css'
})

export class DashboardUser implements OnInit {
public username:string | undefined='';
invoices: Invoice[] = [];
totalRevenue: number = 0;
pendingPayments: number = 0;
totalInvoices: number = 0;
avgDuration: number = 0;
private currentRole: string = '';

name :string='';

constructor(private authService:AuthService, private billingService: BillingService){}

myActivityData: Activity[] = [];
data : number = 20;
  ngOnInit(): void {
    this.onLoadData();
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

  onLoadData(): void {
      // Logic to load or refresh data can be added here
      // {this.totalRevenue, this.pendingPayments, this.totalInvoices} = calculateBillingTotals();
  
      this.name = this.authService.decodeToken().name;
      
  
      console.log('Loading billing data for role:', this.currentRole);
      if (this.isAdmin()) {
        // Admin sees all invoices
        this.billingService.getAllInvoices().subscribe({
          next: (response) => {
            this.invoices = response.data;
            this.calculateTotals(this.invoices);
          },
          error: (err) => {
            console.error('Error fetching invoices:', err);
            this.invoices = [];
            this.calculateTotals([]);
          }
        });
      } else {
        // Get the current user's ID from the JWT token
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
          console.error('No user ID found in token');
          this.invoices = [];
          this.calculateTotals([]);
          return;
        }
  
        // Get user's specific invoice using getInvoiceById
        this.billingService.getInvoiceById(userId).subscribe({
          next: (response) => {
            // If single invoice, wrap in array, otherwise use as is
            this.invoices = response.data 
            this.calculateTotals(this.invoices);
          },
          error: (err) => {
            console.error('Error fetching user invoice:', err);
            this.invoices = [];
            this.calculateTotals([]);
          }
        });
      }
  
    }
  
    private calculateTotals(invoices: Invoice[]): void {
      const totals = calculateBillingTotals(invoices);
      this.totalRevenue = totals.totalRevenue;
      this.pendingPayments = totals.pendingPayments;
      this.totalInvoices = totals.totalInvoices;
      this.avgDuration = totals.avg;
      // console.log('Average Duration:', this.avgDuration);
    }
  
    public isAdmin(): boolean {
      return this.currentRole === 'admin';
    }
}
