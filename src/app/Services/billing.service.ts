import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, Rate, PaymentMethod } from '../model/billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  // Base URL for all billing-related API calls
  private baseUrl = 'http://localhost:3000/api/billing';

  constructor(private http: HttpClient) { }

  // --- Invoice Endpoints ---

  /**
   * (Admin) Get all invoices
   * Corresponds to: GET /api/billing/invoices
   */
  getAllInvoices(): Observable<{ status: string, results: number, data: Invoice[] }> {
    return this.http.get<{ status: string, results: number, data: Invoice[] }>(`${this.baseUrl}/invoices`);
  }

  /**
   * (User/Admin) Get a specific invoice by its ID
   * Corresponds to: GET /api/billing/invoices/:id
   */
  getInvoiceById(id: string): Observable<{ status: string, data: Invoice }> {
    return this.http.get<{ status: string, data: Invoice }>(`${this.baseUrl}/invoices/${id}`);
  }

  /**
   * (User) Generate a new invoice
   * Corresponds to: POST /api/billing/invoices
   */
  generateInvoice(invoiceData: { 
    userId: string, 
    parkingSpotId: string, 
    vehicleType: string, 
    checkInTime: Date, 
    checkOutTime: Date 
  }): Observable<{ status: string, data: Invoice }> {
    return this.http.post<{ status: string, data: Invoice }>(`${this.baseUrl}/invoices`, invoiceData);
  }

  /**
   * (User) Process payment for a specific invoice
   * Corresponds to: PUT /api/billing/invoices/:id/payment
   */
  processPayment(invoiceId: string, paymentMethod: string): Observable<{ status: string, data: Invoice }> {
    return this.http.put<{ status: string, data: Invoice }>(
      `${this.baseUrl}/invoices/${invoiceId}/payment`, 
      { paymentMethod }
    );
  }

  /**
   * (User) Get available payment methods
   * Corresponds to: GET /api/billing/payment-methods
   */
  getPaymentMethods(): Observable<{ status: string, data: PaymentMethod[] }> {
    return this.http.get<{ status: string, data: PaymentMethod[] }>(`${this.baseUrl}/payment-methods`);
  }

  // --- Rate Endpoints (Admin) ---

  /**
   * (Admin) Get all vehicle rates
   * Corresponds to: GET /api/billing/rates
   */
  getRates(): Observable<{ status: string, data: Rate[] }> {
    return this.http.get<{ status: string, data: Rate[] }>(`${this.baseUrl}/rates`);
  }

  /**
   * (Admin) Create a new rate for a vehicle type
   * Corresponds to: POST /api/billing/rates
   */
  createRate(rateData: { 
    vehicleType: string, 
    baseRate: number, 
    additionalHourRate: number 
  }): Observable<{ status: string, data: Rate }> {
    return this.http.post<{ status: string, data: Rate }>(`${this.baseUrl}/rates`, rateData);
  }

  /**
   * (Admin) Update an existing rate
   * Corresponds to: PUT /api/billing/rates/:vehicleType
   */
  updateRate(vehicleType: string, rateData: { 
    baseRate: number, 
    additionalHourRate: number 
  }): Observable<{ status: string, data: Rate }> {
    return this.http.put<{ status: string, data: Rate }>(`${this.baseUrl}/rates/${vehicleType}`, rateData);
  }
}
