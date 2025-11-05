export interface ParkingRecord {
  id: number;
  vehicleNumber: string;
  vehicleType: '4W' | '2W';
  customerName: string;
  slotId: string;
  entryTime: Date;
  exitTime: Date | null;
  status: 'Parked' | 'Completed' | 'Reserved';
}

export interface Invoice {
  invoiceNumber: string;
  parkingRecordId: number;
  customerName: string;
  vehicleNumber: string;
  slotId: string;
  durationMinutes: number;
  rate: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'Paid' | 'Pending';
  paymentMethod?: string;
}

export interface Rate {
  vehicleType: '4W' | '2W';
  baseRate: number;
  additionalHourRate: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
}

export interface BillingError {
  status: string;
  message: string;
}
