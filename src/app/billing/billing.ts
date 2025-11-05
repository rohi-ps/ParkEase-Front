import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BillingService } from '../Services/billing.service';
import { AuthService } from '../Services/auth.service';
import { Invoice, PaymentMethod } from '../model/billing';

@Component({
  selector: 'app-billing',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class Billing implements OnInit {
    
  public invoices: Invoice[] = [];
  public totalRevenue: number = 0;
  public pendingPayments: number = 0;
  public totalInvoices: number = 0;
  public paymentMethods: PaymentMethod[] = [];
  private currentRole: string = '';
  private currentUser: string = '';
  public loading: boolean = false;
  public error: string | null = null;

  constructor(
    private billingService: BillingService,
    private authService: AuthService
  ) {
    this.currentRole = this.authService.getCurrentUserRole();
    this.currentUser = this.authService.getCurrentUserEmail();
  }

  ngOnInit(): void {
    this.loadData();
    this.loadPaymentMethods();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.billingService.getAllInvoices().subscribe({
      next: (response) => {
        this.invoices = response.data;
        this.calculateTotals();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.error = 'Failed to load invoices. Please try again later.';
        this.loading = false;
      }
    });
  }

  private loadPaymentMethods(): void {
    this.billingService.getPaymentMethods().subscribe({
      next: (response) => {
        this.paymentMethods = response.data;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  private calculateTotals(): void {
    this.totalRevenue = this.invoices
      .filter(inv => inv.paymentStatus === 'Paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    this.pendingPayments = this.invoices
      .filter(inv => inv.paymentStatus === 'Pending')
      .reduce((sum, inv) => sum + inv.total, 0);

    this.totalInvoices = this.invoices.length;
  }

  payInvoice(invoiceNumber: string): void {
    this.loading = true;
    this.error = null;

    // For now, we'll use 'credit_card' as default payment method
    this.billingService.processPayment(invoiceNumber, 'credit_card').subscribe({
      next: (response) => {
        this.loadData(); // Reload data after successful payment
        this.loading = false;
      },
      error: (error) => {
        console.error('Error processing payment:', error);
        this.error = 'Failed to process payment. Please try again later.';
        this.loading = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.currentRole === 'admin';
  }

  canPayInvoice(invoice: Invoice): boolean {
    return this.isAdmin() || invoice.customerName === this.currentUser;
  }

  formatDuration(minutes: number): string {
    return this.billingService.formatDurationFromMinutes(minutes);
  }

  formatCurrency(amount: number): string {
    return this.billingService.formatCurrency(amount);
  }
}