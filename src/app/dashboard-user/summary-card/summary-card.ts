import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  imports: [],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.css'
})
export class SummaryCard implements OnInit{
 @Input() slotNumber: string = 'N/A';
  @Input() vehicleNumber: string = 'N/A';
  @Input() duration: string = '0h 0m';
  @Input() estimatedCost: string = '$0.00'; // Keep as string for formatting

  // Output events to notify parent component of actions
  @Output() extendParking = new EventEmitter<void>();
  @Output() endParking = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    // You can add initialization logic here if needed
  }

  onExtendParking(): void {
    console.log('Extend Parking button clicked!');
    // Emit an event to the parent component
    this.extendParking.emit();
  }

  onEndParking(): void {
    console.log('End Parking button clicked!');
    // Emit an event to the parent component
    this.endParking.emit();
  }
}
