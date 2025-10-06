import { Injectable } from '@angular/core';
import { ParkingSlot } from '../model/parking-slots-module';
import { parkingSlots } from '../model/parking-data';

@Injectable({
  providedIn: 'root',
})
export class ParkingSlotsUserService {
  slots: ParkingSlot[] = parkingSlots;
  rows: string[] = ["A","B","C","D"];
  cols = 0;
  asciiValue = 69;
  tAvailCount = 0;
  tReserveCount = 0;

  constructor() {
    
    
  
    this.tAvailCount = this.slots.filter(slot => slot.status === 'available').length;
    this.tReserveCount = this.slots.filter(slot => slot.status === 'occupied').length;
  }

  getCreateSlots() {
    let vehicleType = prompt('Enter vehicle type (2W or 4W):');
    if (vehicleType === '2W' || vehicleType === '4W') {
      if (this.cols === 10 || this.cols === 0) {
        const char = String.fromCharCode(this.asciiValue);
        this.rows.push(char);
        this.cols = 0;
        this.asciiValue++;
      }
      this.cols = this.cols + 1;
      this.getPushSlots(String(vehicleType));
    } else {
      alert('enter a valid vehicle type');
    }
    this.tAvailCount = this.slots.filter(slot => slot.status === 'available').length;
    this.tReserveCount = this.slots.filter(slot => slot.status === 'occupied').length;
    return this.slots;
  }

  getPushSlots(type: string) {
    const text = this.rows.slice(-1)[0] + this.cols;
    this.slots.push({
      id: text,
      vehicleType: type,
      availability: 'available',
      status: 'available',
    });
  }
   // --- NEW METHOD ---
  // Returns only the slots that are currently available.
  getAvailableSlots(): ParkingSlot[] {
    return this.slots.filter(slot => slot.status === 'available');
  }

  // --- NEW METHOD ---
  // Finds a slot by its ID and updates its status.
  updateSlotStatus(slotId: string, newStatus: 'available' | 'occupied'): void {
    const slotToUpdate = this.slots.find(slot => slot.id === slotId);
    if (slotToUpdate) {
      slotToUpdate.status = newStatus;
      console.log(`Slot ${slotId} status updated to ${newStatus}`);
    } else {
      console.error(`Could not find slot with ID: ${slotId} to update.`);
    }
  }

  updateSlot(updatedSlot: ParkingSlot) {
    //  this.slots.maps(slot => slot.id === updateSlot.id? slot.status = updateSlot.status : slot.status);
  this.slots.map(slot => slot.id === updatedSlot.id ? slot.status = updatedSlot.status : slot.status);
  this.tAvailCount = this.slots.filter(slot => slot.status === 'available').length;
  this.tReserveCount = this.slots.filter(slot => slot.status === 'occupied').length;
  
  }

  getRefreshSlots() {
    if (this.slots.length > 0) {
      const removedSlot = this.slots.pop();

      if (this.cols === 1) {
        this.rows.pop();
        this.asciiValue--;
        this.cols = 10;
      } else {
        this.cols--;
      }
    } else {
      alert('no slots to remove');
    }
    this.tAvailCount = this.slots.filter(slot => slot.status === 'available').length;
    this.tReserveCount = this.slots.filter(slot => slot.status === 'occupied').length;
    return this.slots;
  }

  getTcount() {
    return this.tAvailCount;
  }
  getSlots() {
    return this.tAvailCount;
  }
  getOccupiedSlots(){
    return this.tReserveCount;
  }

}
