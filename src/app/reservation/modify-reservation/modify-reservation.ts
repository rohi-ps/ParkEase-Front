import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Customer } from '../../model/customers';
import { CustomerService } from '../../Services/customer-service';
import { ParkingSlotsUserService } from '../../Services/parking-slots-user.service';
import { ParkingSlot } from '../../model/parking-slots-module';

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

  originalDurationMinutes: number = 0;
  originalAmount: number = 0;
  additionalAmount: string = '';

  constructor(
    private parkingSlotsService: ParkingSlotsUserService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
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

      this.originalDurationMinutes = this.customerService.calculateDurationInMinutes(
        this.customer.entryDate,
        this.customer.entryTime,
        this.customer.exitDate,
        this.customer.exitTime
      );

      const ratePerMinute = this.customer.vehicleType === '2W' ? 20 / 60 : 30 / 60;
      const subtotal = this.originalDurationMinutes * ratePerMinute;
      const tax = subtotal * 0.08;
      this.originalAmount = Math.round((subtotal + tax) * 100) / 100;

      this.updateAmount();
    }
  }

  async loadData(): Promise<void> {
    this.availableSlots = await this.parkingSlotsService.getAvailableSlots();
  }

  updateAmount(): void {
    if (this.form.vehicleType &&this.form.entryDate &&this.form.entryTime &&this.form.exitDate &&this.form.exitTime) {
      const newDuration = this.customerService.calculateDurationInMinutes(this.form.entryDate,this.form.entryTime,this.form.exitDate,this.form.exitTime);

      const ratePerMinute = this.form.vehicleType === '2W' ? 20 / 60 : 30 / 60;
      const newSubtotal = newDuration * ratePerMinute;
      const newTax = newSubtotal * 0.08;
      const newTotal = Math.round((newSubtotal + newTax) * 100) / 100;

      const diff = newTotal - this.originalAmount;
      const roundedDiff = Math.round(diff * 100) / 100;

      this.additionalAmount = diff >= 0? `+₹${roundedDiff}`: `-₹${Math.abs(roundedDiff)}`;
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

  onSlotChange(form: NgForm): void {
    const slotId = form.value.slotId;
    if (!slotId) return;
    const selectedSlot = this.availableSlots.find(slot => slot.slotName === slotId);
    if (selectedSlot) {
      form.form.patchValue({
        vehicleType: selectedSlot.vehicleType
      });
      this.form.vehicleType = selectedSlot.vehicleType;
      this.updateAmount();
    }
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
        slotId: this.form.slotId,
        vehicleType: this.form.vehicleType,
        vehicleNumber: this.form.vehicleNumber,
        entryDate: this.form.entryDate,
        entryTime: this.form.entryTime,
        exitDate: this.form.exitDate,
        exitTime: this.form.exitTime,
        Duration: this.customerService.formatDurationFromMinutes(updatedDuration),
        Amount: this.customerService.calculateAmount(this.form.vehicleType, updatedDuration),
        // status: 'Upcoming'
      };

      this.customerService.updateCustomer(updatedCustomer).subscribe({
        next: response => {
          console.log('Reservation updated successfully', response);
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