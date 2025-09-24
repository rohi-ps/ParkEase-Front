import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, combineLatest  } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParkingRecord,Invoice } from '../model/billing';


@Injectable({
  providedIn: 'root'
})
export class Parkingservice {
  private readonly _parkingRecords = new BehaviorSubject<ParkingRecord[]>([]);
  public readonly parkingRecords$: Observable<ParkingRecord[]> = this._parkingRecords.asObservable();

  private readonly _invoices = new BehaviorSubject<Invoice[]>([]);
  public readonly invoices$: Observable<Invoice[]> = this._invoices.asObservable();
  
  private nextId = 1;
  private nextInvoiceId = 1;

  constructor() {
    
    const minuteTimer$ = timer(0, 60000);
    this.parkingRecords$ = combineLatest([
      this._parkingRecords.asObservable(),
      minuteTimer$                     
    ]).pipe(
      map(([records, _tick]) => records)
    );

    const initialData: ParkingRecord[] = [];
    this._parkingRecords.next(initialData);

  }

  public get totalRevenue$(): Observable<number> {
    return this.invoices$.pipe(
      map(invoices => invoices
        
        .filter(inv => inv.paymentStatus === 'Paid')
       
        .reduce((sum, inv) => sum + inv.total, 0)
      )
    );
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

    const currentInvoices = this._invoices.getValue();
    this._invoices.next([...currentInvoices, newInvoice]);
  }


  markAsPaid(invoiceNumber: string): void {
    const currentInvoices = this._invoices.getValue();
    const invoiceToPay = currentInvoices.find(inv => inv.invoiceNumber === invoiceNumber);

    if (invoiceToPay) {
      invoiceToPay.paymentStatus = 'Paid';
      this._invoices.next([...currentInvoices]);
    }
  }


  
  logEntry(entryData: { vehicleNumber: string; vehicleType: '4W' | '2W'; customerName: string; slotId: string; }): void {
    const currentRecords = this._parkingRecords.getValue();

    const newRecord: ParkingRecord = {
      id: this.nextId++,
      vehicleNumber: entryData.vehicleNumber,
      vehicleType: entryData.vehicleType,
      customerName: entryData.customerName,
      slotId: entryData.slotId,
      entryTime: new Date(),
      exitTime: null,
      status: 'Parked'
    };

    this._parkingRecords.next([...currentRecords, newRecord]);
    console.log('Service: Vehicle Entered:', newRecord);
  }


  logExit(vehicleNumber: string): void {
    const currentRecords = this._parkingRecords.getValue();
    const recordToUpdate = currentRecords.find(
      record => record.vehicleNumber === vehicleNumber && record.status === 'Parked'
    );

    if (recordToUpdate) {
      recordToUpdate.status = 'Completed';
      recordToUpdate.exitTime = new Date();
      this._parkingRecords.next([...currentRecords]);
      this.generateInvoice(recordToUpdate);
    }
  }

  calculateDuration(entryTime: Date, exitTime: Date | null): string {
    const endTime = exitTime ? new Date(exitTime) : new Date();
    const startTime = new Date(entryTime);
    let diffMs = endTime.getTime() - startTime.getTime();
    if (diffMs < 0) return '0m';
    const totalMinutes = Math.floor(diffMs / 60000);
    return this.formatDurationFromMinutes(totalMinutes);
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
