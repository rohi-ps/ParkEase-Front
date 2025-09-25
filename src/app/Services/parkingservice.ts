import { Injectable } from '@angular/core';
import { Invoice, ParkingRecord } from '../model/billing';
import { ParkingSlotsUserService } from './parking-slots-user.service'; 


@Injectable({
  providedIn: 'root'
})
export class Parkingservice {
  // Use simple private arrays for data storage
  private _parkingRecords: ParkingRecord[] = [];
  private _invoices: Invoice[] = [];
  
  private nextId = 1;
  private nextInvoiceId = 1;

  constructor(private parkingSlotsService: ParkingSlotsUserService) {}
  
  public getParkingRecords(): ParkingRecord[] {
    return [...this._parkingRecords]; // Return a copy to prevent mutation
  }

  public getInvoices(): Invoice[] {
    return [...this._invoices]; // Return a copy
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
