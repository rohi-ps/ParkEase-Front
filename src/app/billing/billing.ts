import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parkingservice } from '../Services/parkingservice';
import { Invoice } from '../model/billing';

@Component({
  selector: 'app-billing',
  imports: [CommonModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class Billing {
   
  public invoices$: Observable<Invoice[]>;
  public totalRevenue$: Observable<number>;
  public pendingPayments$: Observable<number>;
  public totalInvoices$: Observable<number>;

  constructor(public parkingService: Parkingservice) {
    this.invoices$ = this.parkingService.invoices$;

    this.totalRevenue$ = this.invoices$.pipe(
      map(invoices => invoices
        .filter(inv => inv.paymentStatus === 'Paid')
        .reduce((sum, inv) => sum + inv.total, 0)
      )
    );

    this.pendingPayments$ = this.invoices$.pipe(
      map(invoices => invoices
        .filter(inv => inv.paymentStatus === 'Pending')
        .reduce((sum, inv) => sum + inv.total, 0)
      )
    );

    this.totalInvoices$ = this.invoices$.pipe(
      map(invoices => invoices.length)
    );
  }

  payInvoice(invoiceNumber: string): void {
    this.parkingService.markAsPaid(invoiceNumber);
  }

}
