import { Invoice } from '../model/billing.model';

/**
 * Format duration between two dates into a human-readable string
 * @param checkInTime Check-in date
 * @param checkOutTime Check-out date
 * @returns Formatted duration string (e.g., "2 hrs 30 mins")
 */
export function formatDuration(checkInTime: Date, checkOutTime: Date): string {
  const start = new Date(checkInTime);
  const end = new Date(checkOutTime);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours === 0) {
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
  }
}

/**
 * Format currency amount in INR
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

/**
 * Calculate total amount for an invoice
 * @param invoice Invoice object
 * @returns Calculated total amount or 0 if invalid
 */
export function calculateInvoiceAmount(invoice: Invoice | null): number {
  if (!invoice || !invoice.totalAmount) {
    return 0;
  }
  return invoice.totalAmount.baseRate + 
         (invoice.totalAmount.additionalHourRate * (invoice.totalAmount.hours - 1));
}

/**
 * Calculate billing totals from a list of invoices
 * @param invoices List of invoices
 * @returns Object containing revenue, pending payments, and total count
 */
export function calculateBillingTotals(invoices: Invoice[]) {
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => {
      const amount = inv.totalAmount.baseRate + 
                    (inv.totalAmount.additionalHourRate * (inv.totalAmount.hours - 1));
      return sum + amount;
    }, 0);

  const pendingPayments = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => {
      const amount = inv.totalAmount.baseRate + 
                    (inv.totalAmount.additionalHourRate * (inv.totalAmount.hours - 1));
      return sum + amount;
    }, 0);

  return {
    totalRevenue,
    pendingPayments,
    totalInvoices: invoices.length
  };
}

/**
 * Get user's display name from user ID
 * @param userId User ID or user object
 * @returns Display name
 */
export function getUserDisplayName(userId: string | { email: string, name: string } | null): string {
  if (!userId) return 'Guest User';
  if (typeof userId === 'object') return userId.name;
  return 'Guest User';
}
