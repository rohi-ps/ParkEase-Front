import { Injectable } from '@angular/core';
import { Invoice, ParkingRecord } from '../model/billing.model';
import { ParkingSlotsUserService } from './parking-slots-user.service';
 
@Injectable({
  providedIn: 'root'
})
export class Parkingservice {
  private _parkingRecords: ParkingRecord[] = [];
  private _invoices: Invoice[] = [];
 
  private nextId = 1;
  private nextInvoiceId = 1;
 
  constructor(private parkingSlotsService: ParkingSlotsUserService) {
    this._initializeStaticData();
  }
 
  public getParkingRecords(role: string, username?: string): ParkingRecord[] {
    if (role === 'admin') {
      return [...this._parkingRecords];
    } else {
      return [...this._parkingRecords.filter(record => record.customerName === username)];
    }
  }
 
  public getInvoices(role: string, userEmail?: string): Invoice[] {
    if (role === 'admin') {
      return [...this._invoices];
    } else {
      return [...this._invoices.filter(invoice =>
        typeof invoice.userId === 'object' && invoice.userId.email === userEmail
      )];
    }
  }
  private _initializeStaticData(): void {
    const now = new Date();
 
    // --- STATIC PARKING RECORDS ---
    this._parkingRecords = [
      {
        id: 1,
        vehicleNumber: 'MH-10-AB-1111',
        vehicleType: '4W',
        customerName: 'Dhruv',
        slotId: 'A1',
        entryTime: new Date(now.getTime() - 60 * 60 * 1000), // Parked 1 hour ago
        exitTime: null,
        status: 'Parked',
      },
      {
        id: 2,
        vehicleNumber: 'MH-12-CD-2222',
        vehicleType: '2W',
        customerName: 'Jagan',
        slotId: 'B2',
        entryTime: new Date(now.getTime() - 3 * 60 * 60 * 1000), // Entered 3 hours ago
        exitTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // Exited 1 hour ago
        status: 'Completed',
      },
      {
        id: 3,
        vehicleNumber: 'MH-14-EF-3333',
        vehicleType: '4W',
        customerName: 'Devraj',
        slotId: 'C3',
        entryTime: new Date(now.getTime() - 26 * 60 * 60 * 1000), // Entered 26 hours ago (yesterday)
        exitTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Exited 24 hours ago (yesterday)
        status: 'Completed',
      },
       {
        id: 4,
        vehicleNumber: 'MH-09-GH-4444',
        vehicleType: '2W',
        customerName: 'Rohit',
        slotId: 'D4',
        entryTime: new Date(now.getTime() - 15 * 60 * 1000), // Parked 15 minutes ago
        exitTime: null,
        status: 'Parked',
      },
    ];
 
    this._invoices = [
      {
        _id: '1',
        invoiceId: 'INV-001',
        userId: { email: 'jagan@example.com', name: 'Jagan' },
        parkingSpotId: 'B2',
        vehicleType: '2W',
        checkInTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        checkOutTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        totalAmount: {
          baseRate: 100.00,
          additionalHourRate: 20.00,
          hours: 2
        },
        status: 'pending',
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
      },
      {
        _id: '2',
        invoiceId: 'INV-002',
        userId: { email: 'devraj@example.com', name: 'Devraj' },
        parkingSpotId: 'C3',
        vehicleType: '4W',
        checkInTime: new Date(now.getTime() - 26 * 60 * 60 * 1000),
        checkOutTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        totalAmount: {
          baseRate: 150.00,
          additionalHourRate: 30.00,
          hours: 2
        },
        status: 'paid',
        paymentMethod: 'CARD',
        paymentDate: new Date(now.getTime() - 23 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000)
      }
    ];
 
    // --- UPDATE ID COUNTERS ---
    // Ensuring new records don't have conflicting IDs
    this.nextId = this._parkingRecords.length + 1;
    this.nextInvoiceId = this._invoices.length + 1;
  }
 
 
  private generateInvoice(record: ParkingRecord): void {
    if (!record.exitTime) return;
 
    const now = new Date();
    const checkInTime = new Date(record.entryTime);
    const checkOutTime = new Date(record.exitTime);
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const hours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60))); // Round up to nearest hour
   
    // Base rates based on vehicle type
    const rates = {
      '2W': { base: 50, additional: 10 },
      '4W': { base: 100, additional: 20 }
    };
   
    const rate = rates[record.vehicleType];
   
    const newInvoice: Invoice = {
        _id: String(this.nextInvoiceId++),
        invoiceId: `INV-${String(this.nextInvoiceId).padStart(3, '0')}`,
        userId: {
          email: `${record.customerName.toLowerCase()}@example.com`,
          name: record.customerName
        },
        parkingSpotId: record.slotId,
        vehicleType: record.vehicleType,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        totalAmount: {
          baseRate: rate.base,
          additionalHourRate: rate.additional,
          hours: hours
        },
        status: 'pending',
        createdAt: now,
        updatedAt: now
    };
 
    this._invoices.push(newInvoice);
  }
 
  markAsPaid(invoiceId: string): void {
    const invoiceToPay = this._invoices.find(inv => inv._id === invoiceId);
    if (invoiceToPay) {
      invoiceToPay.status = 'paid';
      invoiceToPay.paymentMethod = 'CARD';
      invoiceToPay.paymentDate = new Date();
      invoiceToPay.updatedAt = new Date();
    }
  }
 
  logEntry(entryData: { vehicleNumber: string; vehicleType: '4W' | '2W'; customerName: string; slotId: string; }): void {
    const newRecord: ParkingRecord = {
      id: this.nextId++,
      ...entryData,
      entryTime: new Date(),
      exitTime: null,
      status: 'Parked'
    };
 
    this._parkingRecords.push(newRecord);
     // After logging the entry, update the slot status to 'occupied'
    this.parkingSlotsService.updateSlotStatus(entryData.slotId, 'occupied');
    console.log('Service: Vehicle Entered:', newRecord);
  }
 
  logExit(vehicleNumber: string): void {
    const recordToUpdate = this._parkingRecords.find(
      record => record.vehicleNumber === vehicleNumber && record.status === 'Parked'
    );
 
    if (recordToUpdate) {
      recordToUpdate.status = 'Completed';
      recordToUpdate.exitTime = new Date();
      // Before generating the invoice, update the slot status back to 'available'
      this.parkingSlotsService.updateSlotStatus(recordToUpdate.slotId, 'available');
      this.generateInvoice(recordToUpdate);
    }
  }
 
  formatDurationFromMinutes(totalMinutes: number): string {
    if (totalMinutes < 0) return '0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
 
 
}