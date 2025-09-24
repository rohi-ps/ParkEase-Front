import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription , Observable } from 'rxjs';
import { Parkingservice } from '../Services/parkingservice';
import { ParkingRecord } from '../model/billing';
@Component({
  selector: 'app-vehicle-logs',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './vehicle-logs.html',
  styleUrls: ['./vehicle-logs.css']
})
export class VehicleLogs implements OnInit, OnDestroy {
  

  public parkingRecords: ParkingRecord[] = [];
  private recordsSubscription: Subscription | undefined;
  private timer:any;
  public totalRevenue$!: Observable<number>;

  constructor(public parkingService: Parkingservice) {
    this.totalRevenue$ = this.parkingService.totalRevenue$;

  }

  ngOnInit() {
    this.timer = setInterval(() => {},60000)
    this.recordsSubscription = this.parkingService.parkingRecords$.subscribe(records => {
      this.parkingRecords = records;
    });
  }

  ngOnDestroy() {
    if(this.timer){
      clearInterval(this.timer);
    }
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
    }
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
  }

  logExit(form: NgForm): void {
    if (form.invalid) return;
    const selectedVehicleNumber = form.value.selectedVehicleNumber;
    this.parkingService.logExit(selectedVehicleNumber);
    form.resetForm();
  }
  
  markAsExitedFromTable(vehicleNumber: string): void {
    this.parkingService.logExit(vehicleNumber);
  }

}