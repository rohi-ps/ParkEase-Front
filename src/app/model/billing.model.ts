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
// This file defines the data structures based on your backend code
 
export interface Invoice {
  _id: string;
  invoiceId: string;
  userId: string | { email: string, name: string }; // Can be populated
  parkingSpotId: string;
  vehicleType: string;
  checkInTime: Date;
  checkOutTime: Date;
  totalAmount: {
    baseRate: number;
    additionalHourRate: number;
    hours: number;
  };
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  reservationId?: string | null;
}
 
export interface Rate {
  _id: string;
  vehicleType: string;
  baseRate: number;
  additionalHourRate: number;
  createdAt: Date;
  updatedAt: Date;
}
 
// Based on the PAYMENT_METHODS util in your backend
export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}
 