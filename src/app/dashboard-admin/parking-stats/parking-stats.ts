import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ParkingSlotsUserService } from '../../Services/parking-slots-user.service';

@Component({
  selector: 'app-parking-stats',
  imports: [],
  templateUrl: './parking-stats.html',
  styleUrl: './parking-stats.css'
})
export class ParkingStats implements OnChanges {
// @Input() availableSlots: number = 0;
// @Input() occupiedSlots: number = 0;

  availableSlots: number = 10;
  occupiedSlots: number = 10;
  reservedSlots: number = 10;
  
  constructor(public parkingSlotsUserService: ParkingSlotsUserService) { }
  // Properties to hold the calculated percentages
  availablePercentage: number = 0;
  occupiedPercentage: number = 0;
  reservedPercentage: number = 0;
  
  // Use OnChanges to recalculate percentages whenever an Input property changes
  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePercentages();
    this.availableSlots = this.parkingSlotsUserService.getSlots();
    this.occupiedSlots = this.parkingSlotsUserService.getReservedSlots();
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
