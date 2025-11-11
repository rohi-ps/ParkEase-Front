import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from './stat-card.component/stat-card.component';
import { ParkingStats } from "./parking-stats/parking-stats";
import { Stat } from '../model/dashboard-user-model';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { 
  calculateBillingTotals,
  getUserDisplayName
} from '../utils/billing.utils';
import { AuthService } from '../Services/auth.service';
import { BillingService } from '../Services/billing.service';
import { Invoice } from '../model/billing.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, StatCardComponent, ParkingStats],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardComponent implements OnInit {

    invoices: Invoice[] = [];
    totalRevenue: number = 0;
    pendingPayments: number = 0;
    totalInvoices: number = 0;
    private currentRole: string = '';

  constructor(private parkingSlotsUserService : ParkingSlotsUserService, private authService : AuthService, private billingService: BillingService) { 
    this.currentRole = this.authService.getCurrentUserRole();
   }

  availableSlots: number = 0;
  occupiedSlots: number = 0;
  totalSlots: number = 0;
  name : string = '';
  stats: Stat[] = [];
  data = 20;
  async ngOnInit(): Promise<void> {

    this.availableSlots = await this.parkingSlotsUserService.getAvailSlots();
    this.occupiedSlots = await this.parkingSlotsUserService.getOccupiedSlots();
    this.totalSlots = this.availableSlots + this.occupiedSlots;
    await this.onLoadData();
  }


  updateStats(): void {
    this.stats = [
      {
        title: 'Total Parking Slots',
        value: this.totalSlots,
        iconClass: 'far fa-square', 
        iconColor: '#007bff' 
      },
      {
        title: 'Occupied Slots',
        value: this.occupiedSlots,
        iconClass: 'fas fa-truck-moving', 
        iconColor: '#dc3545' 
      },
      {
        title: 'Available Slots',
        value: this.availableSlots,
        iconClass: 'fas fa-check-circle', 
        iconColor: '#28a745' 
      },
      {
        title: 'Today\'s Revenue',
        value: this.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
        iconClass: 'fas fa-dollar-sign', 
        iconColor: '#007bff', 
        isCurrency: true
      },
      {
        title: 'Total Users',
        value: this.totalInvoices, // Assuming you meant a different property here? Both are totalInvoices
        iconClass: 'fas fa-users', 
        iconColor: '#6f42c1' 
      },
      {
        title: 'Total Invoices',
        value: this.totalInvoices,
        iconClass: 'fas fa-calendar-alt', 
        iconColor: '#fd7e14' 
      },
    ];
  }

  async onLoadData(): Promise<void> {
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
          this.updateStats();
        },
        error: (err) => {
          console.error('Error fetching invoices:', err);
          this.invoices = [];
          this.calculateTotals([]);
          this.updateStats();
        }
      });
    } else {
      // Get the current user's ID from the JWT token
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        console.error('No user ID found in token');
        this.invoices = [];
        this.calculateTotals([]);
        this.updateStats();
        return;
      }

      // Get user's specific invoice using getInvoiceById
      this.billingService.getInvoiceById(userId).subscribe({
        next: (response) => {
          // If single invoice, wrap in array, otherwise use as is
          this.invoices = response.data 
          this.calculateTotals(this.invoices);
          this.updateStats();
        },
        error: (err) => {
          console.error('Error fetching user invoice:', err);
          this.invoices = [];
          this.calculateTotals([]);
          this.updateStats();
        }
      });
      
    }

    // this.updateStats();

  }

  private calculateTotals(invoices: Invoice[]): void {
    const totals = calculateBillingTotals(invoices);
    this.totalRevenue = totals.totalRevenue;
    this.pendingPayments = totals.pendingPayments;
    this.totalInvoices = totals.totalInvoices;
  }

  public isAdmin(): boolean {
    return this.currentRole === 'admin';
  }
}