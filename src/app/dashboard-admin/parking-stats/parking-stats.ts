import { Component, OnInit, inject } from '@angular/core';
import { ParkingSlotsUserService } from '../../Services/parking-slots-user.service';

@Component({
  selector: 'app-parking-stats',
  imports: [],
  templateUrl: './parking-stats.html',
  styleUrl: './parking-stats.css'
})
export class ParkingStats implements OnInit {

  availableSlots: number = 0;
  occupiedSlots: number = 0;
  reservedSlots: number = 0;
  
  constructor() { }
  public parkingSlotsUserService = inject(ParkingSlotsUserService);

  
  // Properties to hold the calculated percentages
  availablePercentage: number = 0;
  occupiedPercentage: number = 0;
  reservedPercentage: number = 0;
  
  // Use OnChanges to recalculate percentages whenever an Input property changes
  ngOnInit(): void {
    this.availableSlots = this.parkingSlotsUserService.getTcount();
    this.occupiedSlots = this.parkingSlotsUserService.getOccupiedSlots();
    this.calculatePercentages();
  }

  private calculatePercentages(): void {
    const totalSlots = this.availableSlots + this.occupiedSlots + this.reservedSlots;
    if (totalSlots > 0) {
      this.availablePercentage = (this.availableSlots / totalSlots) * 100;
      this.occupiedPercentage = (this.occupiedSlots / totalSlots) * 100;
      this.reservedPercentage = (this.reservedSlots / totalSlots) * 100;
    } else {
      this.availablePercentage = 0;
      this.occupiedPercentage = 0;
      this.reservedPercentage = 0;
    }
  }

}
