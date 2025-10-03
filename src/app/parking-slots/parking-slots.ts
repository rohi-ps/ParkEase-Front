import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { Router } from '@angular/router';

// 1. Updated the interface to match the simplified model (removed 'availability')
interface ParkingSlot {
  id: string;
  vehicleType: string;
  status: 'available' | 'occupied';
}

@Component({
  selector: 'app-parking-slots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parking-slots.html',
  styleUrl: './parking-slots.css'
})
export class ParkingSlots implements OnInit {
  @Output() onBookEvent = new EventEmitter<string>();

  slots: ParkingSlot[] = [];
  hoveredSlot: ParkingSlot | null = null;

  constructor(
    private parkkingSlotUserService: ParkingSlotsUserService,
    private route: Router
  ) {}

  ngOnInit(): void {
    // 2. Used the new getter method for clarity
    this.slots = this.parkkingSlotUserService.getAllSlots();
  }

  createSlots() {
    this.slots = this.parkkingSlotUserService.getCreateSlots();
  }

  refreshSlots() {
    this.slots = this.parkkingSlotUserService.getRefreshSlots();
  }

  toggleSlot(slot: ParkingSlot) {
    // 3. This now correctly calls 'updateSlotStatus' with the required parameters
    const newStatus = slot.status === 'available' ? 'occupied' : 'available';
    this.parkkingSlotUserService.updateSlotStatus(slot.id, newStatus);
    
    // Also, update the local component data to reflect the change instantly
    slot.status = newStatus;
  }

  showInfo(slot: ParkingSlot) {
    this.hoveredSlot = slot;
  }

  hideInfo(): void {
    this.hoveredSlot = null;
  }
  
  onBook(slot: ParkingSlot) {
    if (slot.status === 'available') {
        this.onBookEvent.emit(slot.id);
        this.route.navigateByUrl('adminsidenav/vehiclelogs');
    } else {
        alert('This slot is already occupied!');
    }
  }
}