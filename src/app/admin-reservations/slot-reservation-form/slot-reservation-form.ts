import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../Services/customer-service';
import { ParkingSlot } from '../../model/parking-slots-module';
import { ParkingSlotsUserService } from '../../Services/parking-slots-user.service';
@Component({
  selector: 'app-slot-reservation-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './slot-reservation-form.html',
  styleUrl: './slot-reservation-form.css'
})
export class SlotReservationForm {

  public availableSlots: ParkingSlot[] = [];
  constructor(private parkingSlotsService: ParkingSlotsUserService,private customerService:CustomerService){}
  ngOnInit(){
    this.loadData();
  }
  private loadData(): void {
    this.availableSlots = this.parkingSlotsService.getAvailableSlots();
  }
  form = {
    slotId: '',
    VehicleType: '' ,
    vehicleNumber: '',
    EntryDate: '',
    EntryTime: '',
    ExitDate: '',
    ExitTime: ''
  }
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
  onSlotChange(form: NgForm): void {
    const slotId = form.value.slotId;
    if (!slotId) return;

    // Find the full slot object from the selected ID
    const selectedSlot = this.availableSlots.find(slot => slot.slotName === slotId);

    if (selectedSlot) {
      // Use patchValue to update only the vehicleType field in the form
      form.form.patchValue({
        vehicleType: selectedSlot.vehicleType
      });
      this.form.VehicleType = selectedSlot.vehicleType;
      this.updateAmount()
    }
  }
  onSubmit(fo: any): void {
    if (fo.valid) {
      console.log("slot booked", fo.value)
    }
    this.customerService.addtocustomer(this.form.slotId, this.form.vehicleNumber, this.form.VehicleType, this.form.EntryDate, this.form.EntryTime, this.form.ExitDate, this.form.ExitTime, '', '')
  }
}
