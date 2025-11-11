import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Customer } from '../../model/customers';
import { CustomerService } from '../../Services/customer-service';
import { ParkingSlotsUserService } from '../../Services/parking-slots-user.service';
import { ParkingSlot } from '../../model/parking-slots-module';
import { BillingService } from '../../Services/billing.service';
@Component({
  selector: 'app-modify-reservation',
  imports: [FormsModule, CommonModule],
  templateUrl: './modify-reservation.html',
  styleUrl: './modify-reservation.css'
})
export class ModifyReservation {
  @Input() customer: Customer | null = null;
  public availableSlots: ParkingSlot[] = [];
  minDate: string = new Date().toISOString().split('T')[0];

  form = {
    slotId: '',
    vehicleType: '',
    vehicleNumber: '',
    entryDate: '',
    entryTime: '',
    exitDate: '',
    exitTime: ''
  };

  originalAmount: number = 0;
  additionalAmount: string = '';

  constructor(private parkingSlotsService: ParkingSlotsUserService, private customerService: CustomerService, private billingService:BillingService) { }

  ngOnInit(): void {
    this.customerService.loadRates();
    this.loadData();
  }

  ngOnChanges(): void {
    if (this.customer) {
      this.form = {
        slotId: this.customer.slotId,
        vehicleType: this.customer.vehicleType,
        vehicleNumber: this.customer.vehicleNumber,
        entryDate: this.customer.entryDate,
        entryTime: this.customer.entryTime,
        exitDate: this.customer.exitDate,
        exitTime: this.customer.exitTime
      };

      const originalDuration = this.customerService.calculateDurationInMinutes(
        this.customer.entryDate,
        this.customer.entryTime,
        this.customer.exitDate,
        this.customer.exitTime
      );

      const originalAmountStr = this.customerService.calculateAmount(
        this.customer.vehicleType,
        originalDuration
      );

      this.originalAmount = parseFloat(originalAmountStr.replace(/[₹,]/g, '')) || 0;
      this.updateAmount();
    }
  }

  async loadData(): Promise<void> {
    this.availableSlots = await this.parkingSlotsService.getAvailableSlots();
  }

  updateAmount(): void {
    if (
      this.form.vehicleType &&
      this.form.entryDate &&
      this.form.entryTime &&
      this.form.exitDate &&
      this.form.exitTime
    ) {
      const newDuration = this.customerService.calculateDurationInMinutes(
        this.form.entryDate,
        this.form.entryTime,
        this.form.exitDate,
        this.form.exitTime
      );

      const newAmountStr = this.customerService.calculateAmount(this.form.vehicleType, newDuration);
      const newAmount = parseFloat(newAmountStr.replace(/[₹,]/g, '')) || 0;

      const diff = newAmount - this.originalAmount;
      const roundedDiff = Math.round(diff * 100) / 100;

      this.additionalAmount = diff > 0 ? `₹${roundedDiff}` : '';
    } else {
      this.additionalAmount = '';
    }
  }

  checkDateDifference(): void {
    const entryDate = new Date(this.form.entryDate);
    const exitDate = new Date(this.form.exitDate);
    if (!isNaN(entryDate.getTime()) && !isNaN(exitDate.getTime())) {
      const diffDays = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 10) {
        alert('Exit date is more than 10 days after entry date');
        this.form.exitDate = '';
      }
      if (diffDays < 0) {
        alert('Exit date cannot be before entry date');
        this.form.exitDate = '';
        return;
      }
    }
    this.updateAmount();
  }

  checkTimeDifference(): void {
    const entry = new Date(this.form.entryDate + 'T' + this.form.entryTime);
    const exit = new Date(this.form.exitDate + 'T' + this.form.exitTime);
    if (!isNaN(entry.getTime()) && !isNaN(exit.getTime())) {
      const sameDay =
        entry.getFullYear() === exit.getFullYear() &&
        entry.getMonth() === exit.getMonth() &&
        entry.getDate() === exit.getDate();
      if (sameDay && exit < entry) {
        alert('Exit time cannot be earlier than entry time on the same day');
        this.form.exitTime = '';
      }
    }
    this.updateAmount();
  }

  onModify(f: NgForm): void {
    if (f.valid && this.customer) {
      const updatedDuration = this.customerService.calculateDurationInMinutes(
        this.form.entryDate,
        this.form.entryTime,
        this.form.exitDate,
        this.form.exitTime
      );

      const updatedCustomer: Customer = {
        ...this.customer,
        entryDate: this.form.entryDate,
        entryTime: this.form.entryTime,
        exitDate: this.form.exitDate,
        exitTime: this.form.exitTime,
        Duration: this.customerService.formatDurationFromMinutes(updatedDuration),
        Amount: this.customerService.calculateAmount(this.form.vehicleType, updatedDuration)
      };

      this.customerService.updateCustomer(updatedCustomer).subscribe({
        next: response => {
          console.log('Reservation updated successfully', response);
          if (this.customer) {
            const invoicePayload = {
              userId: this.customer.userId,
              parkingSpotId: this.form.slotId,
              vehicleType: this.form.vehicleType,
              checkInTime: new Date(`${this.form.entryDate}T${this.form.entryTime}`),
              checkOutTime: new Date(`${this.form.exitDate}T${this.form.exitTime}`)
            };

            this.billingService.generateInvoice(invoicePayload).subscribe({
              next: invoiceRes => {
                console.log('Updated invoice generated:', invoiceRes);
              },
              error: invoiceErr => {
                console.error('Invoice update failed:', invoiceErr);
              }
            });
          }

        },
        error: error => {
          console.error('Error updating reservation', error);
        }
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}