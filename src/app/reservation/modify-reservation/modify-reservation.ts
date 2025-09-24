import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleTypes, Types } from '../../model/vtypes';
@Component({
  selector: 'app-modify-reservation',
  imports: [FormsModule, CommonModule],
  templateUrl: './modify-reservation.html',
  styleUrl: './modify-reservation.css'
})
export class ModifyReservation {
  vehicleTypes = Types
  form = {
    id: 0,
    slotId: '',
    VehicleType: '' as VehicleTypes,
    vehicleNumber: '',
    EntryDate: '',
    EntryTime: '',
    ExitDate: '',
    ExitTime: ''
  }
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
      else if (diffInDays < 0) {
        alert("Exit date cannot be before entry date");
        this.form.ExitDate = '';
      }
    }
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
  }
  onModify(f: any): void {
    if (f.valid) {
      console.log("modified reservation", f.value)
    }
    
  }
  
}