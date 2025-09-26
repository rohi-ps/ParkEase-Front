import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parkingservice } from '../Services/parkingservice';
import { Invoice } from '../model/billing';

@Component({
  selector: 'app-billing-admin',
  imports: [CommonModule],
  templateUrl: './billing-admin.html',
  styleUrl: './billing-admin.css'
})
export class BillingAdmin implements OnInit {
   public invoices: Invoice[] = [];
  public totalRevenue: number = 0;
  public pendingPayments: number = 0;
  public totalInvoices: number = 0;

  constructor(public parkingService: Parkingservice) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.invoices = this.parkingService.getInvoices();

    this.totalRevenue = this.invoices
      .filter(inv => inv.paymentStatus === 'Paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    this.pendingPayments = this.invoices
      .filter(inv => inv.paymentStatus === 'Pending')
      .reduce((sum, inv) => sum + inv.total, 0);

    this.totalInvoices = this.invoices.length;
  }



}
