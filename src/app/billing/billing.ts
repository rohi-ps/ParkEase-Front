import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { BillingService } from '../Services/billing.service';
import { Invoice } from '../model/billing.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../Services/auth.interceptor';
import { 
  formatDuration,
  formatCurrency,
  calculateInvoiceAmount,
  calculateBillingTotals,
  getUserDisplayName
} from '../utils/billing.utils';
declare var bootstrap: any;
 
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
    TitleCasePipe
  ]
})
export class Billing implements OnInit {
   
  public invoices: Invoice[] = [];
  public totalRevenue: number = 0;
  public pendingPayments: number = 0;
  public totalInvoices: number = 0;
  private currentRole: string = '';
  private currentUserEmail: string = ''; // Changed from currentUser
  
  // Payment modal related properties
  public paymentMethods: {
    name: string;
    enabled: boolean;
  }[] = [];
  public selectedPaymentMethod: string = '';
  public selectedInvoice: Invoice | null = null;
  private paymentModal: any;
 
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
 
  private calculateTotals(invoices: Invoice[]): void {
    const totals = calculateBillingTotals(invoices);
    this.totalRevenue = totals.totalRevenue;
    this.pendingPayments = totals.pendingPayments;
    this.totalInvoices = totals.totalInvoices;
  }
 
  public isAdmin(): boolean {
    return this.currentRole === 'admin';
  }

  public formatCurrency(amount: number): string {
    // This calls the 'formatCurrency' function you imported
    return formatCurrency(amount);
  }

  // FIX: Expose the formatDuration utility function to the template
  public formatDuration(checkInTime: Date, checkOutTime: Date): string {
    // This calls the 'formatDuration' function you imported
    return formatDuration(checkInTime, checkOutTime);
  }
 
  public openPaymentModal(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.selectedPaymentMethod = '';
    
    // Fetch payment methods
    this.billingService.getPaymentMethods().subscribe({
      next: (response) => {
        console.log(response)
        this.paymentMethods = response.data.map((method: any) => ({
          name: method,
          enabled:false
        }));
        console.log('Available payment methods:', this.paymentMethods);
        // Initialize and show the modal
        if (!this.paymentModal) {
          const modalEl = document.getElementById('paymentModal');
          this.paymentModal = new bootstrap.Modal(modalEl);
        }
        this.paymentModal.show();
      },
      error: (err) => {
        console.error('Error fetching payment methods:', err);
      }
    });
  }

  public selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
  }

  public confirmPayment(): void {
    if (!this.selectedInvoice || !this.selectedPaymentMethod) {
      return;
    }

    this.billingService.processPayment(this.selectedInvoice._id, this.selectedPaymentMethod).subscribe({
      next: (response) => {
        console.log('Payment successful:', response);
        this.paymentModal.hide();
        this.loadData(); // Reload data to show updated status
      },
      error: (err) => {
        console.error('Error processing payment:', err);
        // Here you would show an error message to the user
      }
    });
  }

  public getUserName(userId: string | { email: string, name: string } | null): string {
    return getUserDisplayName(userId);
  }

  public calculateInvoiceAmount(invoice: Invoice | null): number {
    return calculateInvoiceAmount(invoice);
  }

}