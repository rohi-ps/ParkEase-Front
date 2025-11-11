import { Injectable } from '@angular/core';
import { Customer } from '../model/customers';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { Rate } from '../model/billing.model'; 
import { tap } from 'rxjs/operators';
import { BillingService } from '../Services/billing.service';
import { AuthService } from '../Services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private rates: Rate[] = [];
  constructor(private http: HttpClient, private billingService:BillingService, private authService:AuthService) {}
  
  // Load all rates into memory
  loadRates(): void {
    this.getrate().subscribe({
      next: (response) => {
        this.rates = response.data;
      },
      error: (err) => {
        console.error('Failed to load rates:', err);
      }
    });
  }

  getallUsers(): Observable<Customer[]> {
    return this.http.get<Customer[]>('http://localhost:3000/api/reservations/getall');
  }
  getReservationsByUser(userId: string): Observable<Customer[]> {
  return this.http.get<Customer[]>(`http://localhost:3000/api/reservations/user/${userId}`);
  }
  
  getrate(): Observable<{ status: string; data: Rate[] }> {
  return this.http.get<{ status: string; data: Rate[] }>('http://localhost:3000/api/rates');
}
  addtocustomer(slotId: string, vehicleNumber: string, vehicleType: string, entryDate: string, entryTime: string, exitDate: string, exitTime: string, Duration: string, Amount: string, status: string = "Upcoming"):Observable<any> {
    const durationMinutes = this.calculateDurationInMinutes(entryDate, entryTime, exitDate, exitTime);
    const duration = this.formatDurationFromMinutes(durationMinutes);
    const amount = this.calculateAmount(vehicleType, durationMinutes);
    const userId = this.authService.getCurrentUserId();
    const newCustomer = { slotId,userId,vehicleNumber, vehicleType, entryDate, entryTime, exitDate, exitTime, Duration:duration, Amount:amount, status };
    return this.http.post<any>('http://localhost:3000/api/reservations/create', newCustomer).pipe(
    tap(() => {
      const userId = this.authService.getCurrentUserId();
      const invoicePayload = {
        userId: userId, 
        parkingSpotId: slotId,
        vehicleType,
        checkInTime: new Date(`${entryDate}T${entryTime}`),
        checkOutTime: new Date(`${exitDate}T${exitTime}`)
      };
      this.billingService.generateInvoice(invoicePayload).subscribe({
        next: res => console.log('Invoice generated:', res),
        error: err => console.error('Invoice error:', err)
      });
    })
  );
  }
  updateCustomer(updated: Customer): Observable<any> {
    const durationMinutes = this.calculateDurationInMinutes(updated.entryDate, updated.entryTime, updated.exitDate, updated.exitTime);
    updated.Duration = this.formatDurationFromMinutes(durationMinutes);
    updated.Amount = this.calculateAmount(updated.vehicleType, durationMinutes);
 
    return this.http.put<any>(`http://localhost:3000/api/reservations/update/${updated.slotId}`, updated);
  }
  calculateDurationInMinutes(entryDate: string, entryTime: string, exitDate: string, exitTime: string): number {
    const entry = new Date(entryDate + 'T' + entryTime);
    const exit = new Date(exitDate + 'T' + exitTime);
    const durationMs = exit.getTime() - entry.getTime();
    return Math.max(1, Math.round(durationMs / 60000)); // at least 1 minute
  }
  formatDurationFromMinutes(totalMinutes: number): string {
    if (totalMinutes < 0) return '0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
  calculateAmount(vehicleType: string, durationMinutes: number): string {
  if (!Array.isArray(this.rates)) {
    console.warn('Rates is not an array:', this.rates);
    return '₹0.00';
  }

  const rate = this.rates.find(r => r.vehicleType === vehicleType);
  if (!rate) {
    console.warn(`No rate found for vehicle type: ${vehicleType}`);
    return '₹0.00';
  }

    const totalHours = durationMinutes / 60;
    const fullHours = Math.floor(totalHours);
    const remainingMinutes = durationMinutes % 60;

    let total = rate.baseRate;

    if (fullHours > 1 || (fullHours === 1 && remainingMinutes > 0)) {
      const extraHours = totalHours - 1;
      total += extraHours * rate.additionalHourRate;
    }
    const finalAmount = total 

    return `₹${finalAmount.toFixed(2)}`;
  }

  cancelReservation(slotId: string): Observable<any> {
  return this.http.delete(`http://localhost:3000/api/reservations/delete/${slotId}`);
}


}