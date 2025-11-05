import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, Rate, PaymentMethod, BillingError } from '../model/billing';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private envService: EnvironmentService
  ) {
    this.apiUrl = `${this.envService.apiUrl}/billing`;
  }

  // Get all invoices (admin only)
  getAllInvoices(): Observable<{ status: string; results: number; data: Invoice[] }> {
    return this.http.get<{ status: string; results: number; data: Invoice[] }>(`${this.apiUrl}/invoices`);
  }

  // Get specific invoice
  getInvoiceByNumber(invoiceNumber: string): Observable<{ status: string; data: Invoice }> {
    return this.http.get<{ status: string; data: Invoice }>(`${this.apiUrl}/invoices/${invoiceNumber}`);
  }

  // Generate new invoice
  generateInvoice(invoiceData: {
    customerName: string;
    vehicleNumber: string;
    vehicleType: string;
    durationMinutes: number;
    parkingSpotId?: string;
  }): Observable<{ status: string; data: Invoice }> {
    return this.http.post<{ status: string; data: Invoice }>(`${this.apiUrl}/invoices`, invoiceData);
  }

  // Process payment for an invoice
  processPayment(invoiceNumber: string, paymentMethod: string): Observable<{ status: string; data: Invoice }> {
    return this.http.put<{ status: string; data: Invoice }>(`${this.apiUrl}/invoices/${invoiceNumber}/payment`, { paymentMethod });
  }

  // Get available payment methods
  getPaymentMethods(): Observable<{ status: string; data: PaymentMethod[] }> {
    return this.http.get<{ status: string; data: PaymentMethod[] }>(`${this.apiUrl}/payment-methods`);
  }

  // Get all rates (admin only)
  getRates(): Observable<{ status: string; data: Rate[] }> {
    return this.http.get<{ status: string; data: Rate[] }>(`${this.apiUrl}/rates`);
  }

  // Create new rate (admin only)
  createRate(rateData: Omit<Rate, 'createdAt' | 'updatedAt'>): Observable<{ status: string; data: Rate }> {
    return this.http.post<{ status: string; data: Rate }>(`${this.apiUrl}/rates`, rateData);
  }

  // Update rate (admin only)
  updateRate(vehicleType: string, rateData: Pick<Rate, 'baseRate' | 'additionalHourRate'>): Observable<{ status: string; data: Rate }> {
    return this.http.put<{ status: string; data: Rate }>(`${this.apiUrl}/rates/${vehicleType}`, rateData);
  }

  // Format duration from minutes to readable string
  formatDurationFromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  // Calculate total from subtotal and tax
  calculateTotal(subtotal: number, taxRate: number = 0.18): { subtotal: number; tax: number; total: number } {
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return {
      subtotal,
      tax,
      total
    };
  }

  // Generate invoice number
  generateInvoiceNumber(prefix: string = 'INV'): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
