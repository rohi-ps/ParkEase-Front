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
}