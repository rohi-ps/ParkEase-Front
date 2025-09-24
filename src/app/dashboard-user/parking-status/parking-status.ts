import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-parking-status',
  imports: [],
  templateUrl: './parking-status.html',
  styleUrl: './parking-status.css'
})
export class ParkingStatus implements OnChanges {
@Input() availableSlots: number = 0;
  @Input() occupiedSlots: number = 0;
  @Input() reservedSlots: number = 0;
  
  // Properties to hold the calculated percentages
  availablePercentage: number = 0;
  occupiedPercentage: number = 0;
  reservedPercentage: number = 0;

  constructor() { }
  
  // Use OnChanges to recalculate percentages whenever an Input property changes
  ngOnChanges(changes: SimpleChanges): void {
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
