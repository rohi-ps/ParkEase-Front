import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parkingservice } from '../Services/parkingservice';
import { AuthService } from '../Services/auth.service';
import { Invoice } from '../model/billing';

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
  private currentRole: string = '';
  private currentUser: string = '';

  constructor(
    public parkingService: Parkingservice,
    private authService: AuthService
  ) {
    this.currentRole = this.authService.getCurrentUserRole();
    this.currentUser = this.authService.getCurrentUser()?.username || '';
  }

  ngOnInit(): void {
    this.loadData();
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
    // Allow payment if user is admin or if the invoice belongs to the current user
    return this.isAdmin() || invoice.customerName === this.currentUser;
  }
}