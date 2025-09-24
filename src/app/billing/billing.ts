import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parkingservice } from "../Services/parkingservice";
import { Invoice } from '../model/invoices';
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

  payInvoice(invoiceNumber: string): void {
    this.parkingService.markAsPaid(invoiceNumber);
    this.loadData();
  }
}