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
    this.currentUser = this.authService.getCurrentUser()?.username || '';
  }

  ngOnInit(): void {
    this.loadData();
    // this.loadPaymentMethods();
  }

  private loadData(): void {
    // Get invoices based on role and username
    // this.invoices = this.parkingService.getInvoices(this.currentRole, this.currentUser);
    console.log(`Fetching invoices for role: ${this.currentRole}, user: ${this.currentUser}`);
    console.log('Invoices received from service:', this.invoices); 

    // Calculate totals based on filtered data
    this.totalRevenue = this.invoices
      .filter(inv => inv.paymentStatus === 'Paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    this.pendingPayments = this.invoices
      .filter(inv => inv.paymentStatus === 'Pending')
      .reduce((sum, inv) => sum + inv.total, 0);

    this.totalInvoices = this.invoices.length;
  }

  payInvoice(invoiceNumber: string): void {
    // this.parkingService.markAsPaid(invoiceNumber);
    this.loadData();
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