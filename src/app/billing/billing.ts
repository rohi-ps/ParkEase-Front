import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
// Corrected paths based on component location
import { AuthService } from '../Services/auth.service';
import { BillingService } from '../Services/billing.service';
import { Invoice } from '../model/billing.model';
 
// Import your interceptor and related providers
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Corrected path, assuming 'Interceptors' directory
import { AuthInterceptor } from '../Services/auth.interceptor';
 
@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule // Add HttpClientModule here for standalone component
  ],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    BillingService,
    AuthService,
  ]
})
export class Billing implements OnInit {
   
  public invoices: Invoice[] = [];
  public totalRevenue: number = 0;
  public pendingPayments: number = 0;
  public totalInvoices: number = 0;
  private currentRole: string = '';
  private currentUserEmail: string = ''; // Changed from currentUser
 
  constructor(
    private authService: AuthService,
    private billingService: BillingService // Inject the new BillingService
  ) {
    this.currentRole = this.authService.getCurrentUserRole();
    this.currentUserEmail = this.authService.getCurrentUserEmail();
  }
 
  ngOnInit(): void {
    this.loadData();
  }
 
  private loadData(): void {
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
          this.invoices = response.data ? [response.data] : [];
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
 
  // Helper function to calculate totals
  private calculateTotals(invoices: Invoice[]): void {
    this.totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => {
        // Base rate plus additional hours (subtract 1 from hours since first hour is covered by base rate)
        const amount = inv.totalAmount.baseRate + 
                      (inv.totalAmount.additionalHourRate * (inv.totalAmount.hours - 1));
        return sum + amount;
      }, 0);
 
    this.pendingPayments = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => {
        const amount = inv.totalAmount.baseRate + 
                      (inv.totalAmount.additionalHourRate * (inv.totalAmount.hours - 1));
        return sum + amount;
      }, 0);
 
    this.totalInvoices = invoices.length;
  }
 
  public formatDuration(checkInTime: Date, checkOutTime: Date): string {
    const start = new Date(checkInTime);
    const end = new Date(checkOutTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
   
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
   
    if (hours === 0) {
      return `${mins} min${mins !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
    }
  }
 
  // Helper method to format currency
  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
 
  public isAdmin(): boolean {
    return this.currentRole === 'admin';
  }
 
  public payInvoice(invoiceId: string): void {
    // Find the invoice by its _id
    const invoiceToPay = this.invoices.find(inv => inv._id === invoiceId);
 
    if (!invoiceToPay) {
       console.error('Could not find invoice with id:', invoiceId);
       return;
    }
 
    // Use 'CARD' as the default payment method
    const selectedPaymentMethod = 'CARD';
   
    this.billingService.processPayment(invoiceToPay._id, selectedPaymentMethod).subscribe({
      next: (response) => {
        console.log('Payment successful:', response);
        this.loadData(); // Reload data to show updated status
      },
      error: (err) => {
        console.error('Error processing payment:', err);
        // Here you would show an error message to the user
      }
    });
  }

  public getUserName(userId: string | { email: string, name: string } | null): string {
    if (!userId) return 'Guest User';
    if (typeof userId === 'object') return userId.name;
    return 'Guest User';
  }

}