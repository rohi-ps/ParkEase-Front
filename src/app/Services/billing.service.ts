import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, Rate, 
  // PaymentMethod 

} from '../model/billing.model';
 
@Injectable({
  providedIn: 'root'
})
export class BillingService {
  // Base URL for all billing-related API calls
  private baseUrl = 'http://localhost:3000/api/billing';
  private rateUrl = 'http://localhost:3000/api/rates';
 
  constructor(private http: HttpClient) { }
 
  // --- Invoice Endpoints ---
 
  /**
   * (Admin) Get all invoices
   * Corresponds to: GET /api/billing/invoices
   */
  getAllInvoices(): Observable<{ status: string, results: number, data: Invoice[] }> {
    console.log('Fetching all invoices from', `${this.baseUrl}/invoices`);
    return this.http.get<{ status: string, results: number, data: Invoice[] }>(`${this.baseUrl}/invoices`);
  }
 
  /**
   * (User/Admin) Get a specific invoice by its ID
   * Corresponds to: GET /api/billing/invoices/:id
   */
  getInvoiceById(id: string): Observable<{ status: string, data: Invoice[] }> {
    return this.http.get<{ status: string, data: Invoice[] }>(`${this.baseUrl}/invoices/${id}`);
  }
 
  /**
   * (User) Generate a new invoice
   * Corresponds to: POST /api/billing/invoices
   */
  generateInvoice(invoiceData: {
    userId: string ,
    parkingSpotId: string,
    vehicleType: string,
    checkInTime: Date,
    checkOutTime: Date,
    reservationId?:string
  }): Observable<{ status: string, data: Invoice }> {
    console.log('Generating invoice with data:', invoiceData);
    return this.http.post<{ status: string, data: Invoice }>(`${this.baseUrl}/invoices`, invoiceData);
  }
 
  /**
   * (User) Process payment for a specific invoice
   * Corresponds to: PUT /api/billing/invoices/:id/payment
   */
  processPayment(invoiceId: string, paymentMethod: string): Observable<{ status: string, data: Invoice }> {
    console.log('Processing payment for invoice ID:', invoiceId, 'with method:', paymentMethod);
    return this.http.put<{ status: string, data: Invoice }>(
      `${this.baseUrl}/invoices/${invoiceId}/payment`,
      { paymentMethod }
    );
  }
 
  /**
   * (User) Get available payment methods
   * Corresponds to: GET /api/billing/payment-methods
   */
  getPaymentMethods(): Observable<{ status: string, data: [] }> {
    return this.http.get<{ status: string, data: [] }>(`${this.baseUrl}/payment-methods`);
  }
 

  // --- Rate Endpoints---
 
  /**
   * Corresponds to: GET /api/billing/rates
   */
  getRates(): Observable<{ status: string, data: Rate[] }> {
    return this.http.get<{ status: string, data: Rate[] }>(`${this.rateUrl}/`);
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
    return this.http.post<{ status: string, data: Rate }>(`${this.rateUrl}/`, rateData);
  }
 
  /**
   * (Admin) Update an existing rate
   * Corresponds to: PUT /api/billing/rates/:vehicleType
   */
  updateRate(vehicleType: string, rateData: {
    baseRate: number,
    additionalHourRate: number
  }): Observable<{ status: string, data: Rate }> {
    return this.http.put<{ status: string, data: Rate }>(`${this.rateUrl}/${vehicleType}`, rateData);
  }
}
