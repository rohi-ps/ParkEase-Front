import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleTypes, Types } from '../../model/vtypes';
import { CustomerService } from '../../Services/customer-service';

@Component({
  selector: 'app-slot-reservation-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './slot-reservation-form.html',
  styleUrl: './slot-reservation-form.css'
})
export class SlotReservationForm {
  vehicleTypes = Types;
  form = {
    slotId: '',
    VehicleType: '' as VehicleTypes,
    vehicleNumber: '',
    EntryDate: '',
    EntryTime: '',
    ExitDate: '',
    ExitTime: ''
  }
  private customerService = inject(CustomerService);

  totalAmount: string = '';
  updateAmount(): void {
    if (this.form.VehicleType && this.form.EntryDate && this.form.EntryTime && this.form.ExitDate && this.form.ExitTime) {
      const durationMinutes = this.customerService.calculateDurationInMinutes(this.form.EntryDate, this.form.EntryTime, this.form.ExitDate, this.form.ExitTime);
      this.totalAmount = this.customerService.calculateAmount(this.form.VehicleType, durationMinutes);
    } else {
      this.totalAmount = '';
    }
  }
  minDate: string = new Date().toISOString().split('T')[0];
  checkDateDifference() {
    const entrydate = new Date(this.form.EntryDate);
    const exitdate = new Date(this.form.ExitDate);
    if (!isNaN(entrydate.getTime()) && !isNaN(exitdate.getTime())) {
      const diffInMs = exitdate.getTime() - entrydate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      if (diffInDays > 10) {
        alert("Exit date is more than 10 days after entry date");
        this.form.ExitDate = '';
      }
    }
    this.updateAmount();
  }
  checkTimeDifference(): void {
    const entryDate = new Date(this.form.EntryDate + 'T' + this.form.EntryTime);
    const exitDate = new Date(this.form.ExitDate + 'T' + this.form.ExitTime);
    if (!isNaN(entryDate.getTime()) && !isNaN(exitDate.getTime())) {
      const sameDay =
        entryDate.getFullYear() === exitDate.getFullYear() &&
        entryDate.getMonth() === exitDate.getMonth() &&
        entryDate.getDate() === exitDate.getDate()
      if (sameDay && exitDate < entryDate) {
        alert('Exit time cannot be earlier than entry time on the same day');
        this.form.ExitTime = '';
      }
    }
    this.updateAmount();
  }
  onSubmit(fo: any): void {
    if (fo.valid) {
      console.log("slot booked", fo.value)
    }
    this.customerService.addtocustomer(this.form.slotId, this.form.vehicleNumber, this.form.VehicleType, this.form.EntryDate, this.form.EntryTime, this.form.ExitDate, this.form.ExitTime, '', '')
  }

}


