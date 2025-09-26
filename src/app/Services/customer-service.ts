import { Injectable } from '@angular/core';
import { Customer } from '../model/customers';
// import { ParkingSlotsUserService } from './parking-slots-user.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // constructor(private parkingSlotsService: ParkingSlotsUserService){}
  customers: Customer[] = [
    {
      id: 1,
      slotId: 'F1',
      vehicleNumber: 'TN09AB1234',
      vehicleType: '2W',
      entryDate: '2025-09-22',
      entryTime: '09:00',
      exitDate: '2025-09-22',
      exitTime: '11:00',
      Duration: '2h',
      Amount: '₹43.20',
      status: 'Upcoming'
    },
    {
      id: 2,
      slotId: 'G2',
      vehicleNumber: 'TN10XY5678',
      vehicleType: '4W',
      entryDate: '2025-09-22',
      entryTime: '10:00',
      exitDate: '2025-09-22',
      exitTime: '13:00',
      Duration: '3h',
      Amount: '₹97.20',
      status: 'Active'
    },
    {
      id: 3,
      slotId: 'H3',
      vehicleNumber: 'TN11CD9012',
      vehicleType: '2W',
      entryDate: '2025-09-21',
      entryTime: '15:00',
      exitDate: '2025-09-21',
      exitTime: '16:00',
      Duration: '1h',
      Amount: '₹21.60',
      status: 'Completed'
    },
    {
      id: 4,
      slotId: 'I4',
      vehicleNumber: 'TN12EF3456',
      vehicleType: '4W',
      entryDate: '2025-09-20',
      entryTime: '07:00',
      exitDate: '2025-09-20',
      exitTime: '11:00',
      Duration: '4h',
      Amount: '₹129.60',
      status: 'Cancelled'
    }
  ];
  getallUsers() {
    return this.customers
  }
  addtocustomer(slotId: string, vehicleNumber: string, vehicleType: string, entryDate: string, entryTime: string, exitDate: string, exitTime: string, Duration: string, Amount: string, status: string = "Upcoming") {
    const durationMinutes = this.calculateDurationInMinutes(entryDate, entryTime, exitDate, exitTime);
    const duration = this.formatDurationFromMinutes(durationMinutes);
    const amount = this.calculateAmount(vehicleType, durationMinutes);
    this.customers.unshift({ id: this.customers.length + 1, slotId, vehicleNumber, vehicleType, entryDate, entryTime, exitDate, exitTime, Duration:duration, Amount:amount, status });
  }
  updateCustomer(updated: Customer): void {
    const durationMinutes = this.calculateDurationInMinutes(updated.entryDate, updated.entryTime, updated.exitDate, updated.exitTime);
    updated.Duration = this.formatDurationFromMinutes(durationMinutes);
    updated.Amount = this.calculateAmount(updated.vehicleType, durationMinutes);
    const index = this.customers.findIndex(c => c.id === updated.id);
    if (index !== -1) {
      this.customers[index] = updated;
    }
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
    const ratePerMinute = vehicleType === '2W' ? 20 / 60 : 30 / 60; // ₹10/hr or ₹15/hr
    const subtotal = durationMinutes * ratePerMinute;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    return `₹${total.toFixed(2)}`;
  }
}
