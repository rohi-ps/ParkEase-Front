import { Injectable } from '@angular/core';
import { Invoice, ParkingRecord } from '../model/billing';
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
  
  public getParkingRecords(): ParkingRecord[] {
    return [...this._parkingRecords]; 
  }

  public getInvoices(): Invoice[] {
    return [...this._invoices]; 
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
        invoiceNumber: 'INV-001',
        parkingRecordId: 2,
        customerName: 'Jagan',
        vehicleNumber: 'MH-12-CD-2222',
        slotId: 'B2',
        durationMinutes: 120, 
        rate: 1.00,
        subtotal: 120.00,
        tax: 9.60,
        total: 129.60,
        paymentStatus: 'Pending',
      },
      {
        invoiceNumber: 'INV-002',
        parkingRecordId: 3,
        customerName: 'Devraj',
        vehicleNumber: 'MH-14-EF-3333',
        slotId: 'C3',
        durationMinutes: 120,
        rate: 1.00,
        subtotal: 120.00,
        tax: 9.60,
        total: 129.60,
        paymentStatus: 'Paid',
      }
    ];

    // --- UPDATE ID COUNTERS ---
    // Ensuring new records don't have conflicting IDs
    this.nextId = this._parkingRecords.length + 1;
    this.nextInvoiceId = this._invoices.length + 1;
  }


  private generateInvoice(record: ParkingRecord): void {
    if (!record.exitTime) return;

    const durationMs = new Date(record.exitTime).getTime() - new Date(record.entryTime).getTime();
    const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
    
    const ratePerMinute = 1.00; 
    const subtotal = durationMinutes * ratePerMinute;
    const tax = subtotal * 0.08; 
    const total = subtotal + tax;

    const newInvoice: Invoice = {
        invoiceNumber: `INV-${String(this.nextInvoiceId++).padStart(3, '0')}`,
        parkingRecordId: record.id,
        customerName: record.customerName,
        vehicleNumber: record.vehicleNumber,
        slotId: record.slotId,
        durationMinutes,
        rate: ratePerMinute,
        subtotal,
        tax,
        total,
        paymentStatus: 'Pending',
    };

    this._invoices.push(newInvoice);
  }

  markAsPaid(invoiceNumber: string): void {
    const invoiceToPay = this._invoices.find(inv => inv.invoiceNumber === invoiceNumber);
    if (invoiceToPay) {
      invoiceToPay.paymentStatus = 'Paid';
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
