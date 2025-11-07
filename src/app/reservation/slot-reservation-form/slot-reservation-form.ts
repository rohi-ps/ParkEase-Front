import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../Services/customer-service';
import { ParkingSlot } from '../../model/parking-slots-module';
import { ParkingSlotsUserService } from '../../Services/parking-slots-user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-slot-reservation-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './slot-reservation-form.html',
  styleUrl: './slot-reservation-form.css'
})
export class SlotReservationForm {
 public availableSlots: ParkingSlot[] = [];
  constructor(private parkingSlotsService: ParkingSlotsUserService,private customerService: CustomerService,private router:Router, private route:ActivatedRoute) {}

  ngOnInit() {
    const slotName = this.route.snapshot.paramMap.get('slotName');
    console.log('Received slotName:', slotName);
    this.form.slotId = slotName ? slotName : '';
    this.form.vehicleType = this.availableSlots.find(slot => slot.slotName === slotName)?.vehicleType || '';
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.availableSlots = await this.parkingSlotsService.getAvailableSlots();
  }

  form = {
    slotId: '',
    vehicleType: '',
    vehicleNumber: '',
    entryDate: '',
    entryTime: '',
    exitDate: '',
    exitTime: ''
  };

  totalAmount: string = '';

  updateAmount(): void {
    if (this.form.vehicleType &&this.form.entryDate &&this.form.entryTime &&this.form.exitDate &&this.form.exitTime
    ) {
      const durationMinutes = this.customerService.calculateDurationInMinutes(this.form.entryDate,this.form.entryTime,this.form.exitDate,this.form.exitTime);
      this.totalAmount = this.customerService.calculateAmount(this.form.vehicleType,durationMinutes);
    } else {
      this.totalAmount = '';
    }
  }

  minDate: string = new Date().toISOString().split('T')[0];

  checkDateDifference() {
    const entrydate = new Date(this.form.entryDate);
    const exitdate = new Date(this.form.exitDate);
    if (!isNaN(entrydate.getTime()) && !isNaN(exitdate.getTime())) {
      const diffInMs = exitdate.getTime() - entrydate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      if (diffInDays > 10) {
        alert('Exit date is more than 10 days after entry date');
        this.form.exitDate = '';
      }
    }
    this.updateAmount();
  }

  checkTimeDifference(): void {
    const entryDate = new Date(this.form.entryDate + 'T' + this.form.entryTime);
    const exitDate = new Date(this.form.exitDate + 'T' + this.form.exitTime);
    if (!isNaN(entryDate.getTime()) && !isNaN(exitDate.getTime())) {
      const sameDay =
        entryDate.getFullYear() === exitDate.getFullYear() &&
        entryDate.getMonth() === exitDate.getMonth() &&
        entryDate.getDate() === exitDate.getDate();
      if (sameDay && exitDate < entryDate) {
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
    console.log('Selected Slot:', selectedSlot);
    if (selectedSlot) {
      form.form.patchValue({
        vehicleType: selectedSlot.vehicleType
      });
      this.form.vehicleType = selectedSlot.vehicleType;
      this.updateAmount();
    }
  }

  onSubmit(fo: any): void {
    if (fo.valid) {
      this.customerService.addtocustomer(this.form.slotId,this.form.vehicleNumber,this.form.vehicleType,this.form.entryDate,this.form.entryTime,this.form.exitDate,this.form.exitTime,'','')
        .subscribe({
          next: response => {
            console.log('Slot booked successfully', response);
          },
          error: error => {
            console.error('Error booking slot', error);
          }
        });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
  onReserve():void{
  this.router.navigateByUrl('usersidenav/userreservation');
 }
}