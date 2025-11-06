import { Injectable } from '@angular/core';
import { Customer } from '../model/customers';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
// import { ParkingSlotsUserService } from './parking-slots-user.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // constructor(private parkingSlotsService: ParkingSlotsUserService){}
  constructor(private http: HttpClient) {}
 
  getallUsers(): Observable<Customer[]> {
    return this.http.get<Customer[]>('http://localhost:3000/api/reservations/allusers');
  }
  addtocustomer(slotId: string, vehicleNumber: string, vehicleType: string, entryDate: string, entryTime: string, exitDate: string, exitTime: string, Duration: string, Amount: string, status: string = "Upcoming"):Observable<any> {
    const durationMinutes = this.calculateDurationInMinutes(entryDate, entryTime, exitDate, exitTime);
    const duration = this.formatDurationFromMinutes(durationMinutes);
    const amount = this.calculateAmount(vehicleType, durationMinutes);
    const newCustomer = { slotId, vehicleNumber, vehicleType, entryDate, entryTime, exitDate, exitTime, Duration:duration, Amount:amount, status };
    return this.http.post<any>('http://localhost:3000/api/reservations/create', newCustomer);
  }
  updateCustomer(updated: Customer): Observable<any> {
    const durationMinutes = this.calculateDurationInMinutes(updated.entryDate, updated.entryTime, updated.exitDate, updated.exitTime);
    updated.Duration = this.formatDurationFromMinutes(durationMinutes);
    updated.Amount = this.calculateAmount(updated.vehicleType, durationMinutes);
 
    return this.http.put<any>(`http://localhost:3000/api/reservations/update/${updated.id}`, updated);
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
    const ratePerMinute = vehicleType === '2W' ? 20 / 60 : 30 / 60; 
    const subtotal = durationMinutes * ratePerMinute;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    return `₹${total.toFixed(2)}`;
  }
  cancelReservation(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/reservations/delete/${id}`);
  }
}