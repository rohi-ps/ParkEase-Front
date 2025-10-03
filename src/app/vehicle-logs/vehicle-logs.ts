import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Parkingservice } from '../Services/parkingservice';
import { ParkingRecord } from '../model/billing';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { ParkingSlot } from '../model/parking-slots-module';

@Component({
  selector: 'app-vehicle-logs',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './vehicle-logs.html',
  styleUrls: ['./vehicle-logs.css']
})
export class VehicleLogs implements OnInit {
  
  public parkingRecords: ParkingRecord[] = [];
  public availableSlots: ParkingSlot[] = [];

  constructor(
    private parkingService: Parkingservice,
    private parkingSlotsService: ParkingSlotsUserService
  ) {}

  ngOnInit() {
    // Load the initial data when the component loads
    this.loadData();
  }

  private loadData(): void {
    // Replace 'admin' and 'username' with actual values as needed
    const role = 'admin'; // or 'user'
    const username = ''; // provide username if role is not 'admin'
    this.parkingRecords = this.parkingService.getParkingRecords(role, username); 
    this.availableSlots = this.parkingSlotsService.getAvailableSlots();
  }

  public get parkingCount(): number {
    return this.parkingRecords.filter(p => p.status === 'Parked').length;
  }

  public get exitCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.parkingRecords.filter(p => {
        if(p.status === 'Completed' && p.exitTime) {
            const exitDate = new Date(p.exitTime);
            exitDate.setHours(0,0,0,0);
            return exitDate.getTime() === today.getTime();
        }
        return false;
    }).length;
  }

  logEntry(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    
    this.parkingService.logEntry(form.value);
    form.reset();
    
    this.loadData();   // Manually refresh the data after the change
  }
  // --- NEW METHOD ---
  // This method is triggered when the user selects a different parking slot.
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
  logExit(form: NgForm): void {
    if (form.invalid) return;
    const selectedVehicleNumber = form.value.selectedVehicleNumber;
    this.parkingService.logExit(selectedVehicleNumber);
    form.resetForm();
    this.loadData();
  }
  
  markAsExitedFromTable(vehicleNumber: string): void {
    this.parkingService.logExit(vehicleNumber);
    this.loadData();
  }
}