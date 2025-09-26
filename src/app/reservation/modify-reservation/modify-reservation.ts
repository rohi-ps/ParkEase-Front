import { Component,Input} from '@angular/core';
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
  constructor(private parkingSlotsService: ParkingSlotsUserService,private customerService:CustomerService){}
  ngOnChanges(): void {
    if (this.customer) {
      this.form = { slotId: this.customer.slotId, VehicleType: this.customer.vehicleType , vehicleNumber: this.customer.vehicleNumber, EntryDate: this.customer.entryDate, EntryTime: this.customer.entryTime, ExitDate: this.customer.exitDate, ExitTime: this.customer.exitTime }
    }
  }
  public availableSlots: ParkingSlot[] = [];
  ngOnInit(){
    this.loadData();
  }
  private loadData(): void {
    this.availableSlots = this.parkingSlotsService.getAvailableSlots();
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
  form = {
    slotId: '',
    VehicleType: '' ,
    vehicleNumber: '',
    EntryDate: '',
    EntryTime: '',
    ExitDate: '',
    ExitTime: ''
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
    this.updateAmount()
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
    this.updateAmount()
  }
  onSlotChange(form: NgForm): void {
    const slotId = form.value.slotId;
    if (!slotId) return;
    // Find the full slot object from the selected ID
    const selectedSlot = this.availableSlots.find(slot => slot.id === slotId);
    if (selectedSlot) {
      // Use patchValue to update only the vehicleType field in the form
      form.form.patchValue({
        vehicleType: selectedSlot.vehicleType
      });
    }
  }
  onModify(f: any): void {
    if (f.valid && this.customer) {
      const updatedCustomer: Customer = {...this.customer,slotId: this.form.slotId,vehicleType: this.form.VehicleType,vehicleNumber: this.form.vehicleNumber,entryDate: this.form.EntryDate,entryTime: this.form.EntryTime,exitDate: this.form.ExitDate,exitTime: this.form.ExitTime};
      this.customerService.updateCustomer(updatedCustomer);
      console.log("modified reservation", updatedCustomer);
    }
  }
  
}