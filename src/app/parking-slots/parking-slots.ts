import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { Router } from '@angular/router';

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

  slots: ParkingSlot[] = [];
  hoveredSlot: ParkingSlot | null = null;

  constructor(
    private parkingSlotUserService: ParkingSlotsUserService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.slots = this.parkingSlotUserService.getAllSlots();
  }

  createSlots() {
    this.slots = this.parkingSlotUserService.getCreateSlots();
  }

  refreshSlots() {
    this.slots = this.parkingSlotUserService.getRefreshSlots();
  }

  toggleSlot(slot: ParkingSlot) {
    const newStatus = slot.status === 'available' ? 'occupied' : 'available';
    this.parkingSlotUserService.updateSlotStatus(slot.id, newStatus);
    
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
        this.route.navigateByUrl('adminsidenav/vehiclelogs');
    } else {
        alert('This slot is already occupied!');
    }
  }
}