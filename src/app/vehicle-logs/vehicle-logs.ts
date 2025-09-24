import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Parkingservice } from '../Services/parkingservice';
import { ParkingRecord } from '../model/parkingRecords';

@Component({
  selector: 'app-vehicle-logs',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './vehicle-logs.html',
  styleUrls: ['./vehicle-logs.css']
})
export class VehicleLogs implements OnInit {
  
  public parkingRecords: ParkingRecord[] = [];
  constructor(public parkingService: Parkingservice) {}

  ngOnInit() {
    // Load the initial data when the component loads
    this.loadData();
  }

  private loadData(): void {
    this.parkingRecords = this.parkingService.getParkingRecords(); 
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