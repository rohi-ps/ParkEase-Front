import { Injectable } from '@angular/core';
import { ParkingSlot } from '../model/parking-slots-module';

@Injectable({
  providedIn: 'root',
})
export class ParkingSlotsUserService {
  slots: ParkingSlot[] = [];
  rows: string[] = [];
  cols = 0;
  asciiValue = 65;
  tCount = 0;

  constructor() {
    const slots = localStorage.getItem('slots');
    const rows = localStorage.getItem('rows');
    const cols = localStorage.getItem('cols');
    const asciiValue = localStorage.getItem('asciiValue'); // <-- Corrected variable name, it's a string

    if (slots) {
      this.slots = JSON.parse(slots);
    }
    if (rows) {
      this.rows = JSON.parse(rows);
    }
    if (cols) {
      this.cols = Number(cols);
    } else {
      this.cols = 0;
    }
    // Corrected logic: check if asciiValue exists before assigning
    if (asciiValue) {
      this.asciiValue = Number(asciiValue); // <-- Convert to a number here
    } else {
      this.asciiValue = 65;
    }
    this.tCount = this.slots.length;
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
    this.tCount = this.slots.length;
    this.saveTasks();
    console.log(this.rows, this.asciiValue, this.cols, this.slots);
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
      this.saveTasks(); // Persist the change to localStorage
      console.log(`Slot ${slotId} status updated to ${newStatus}`);
    } else {
      console.error(`Could not find slot with ID: ${slotId} to update.`);
    }
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
    this.tCount = this.slots.length;
    this.saveTasks();
    return this.slots;
  }

  getTcount() {
    return this.tCount;
  }
  getSlots() {
    return this.tCount;
  }
  private saveTasks() {
    localStorage.setItem('slots', JSON.stringify(this.slots));
    localStorage.setItem('rows', JSON.stringify(this.rows));
    localStorage.setItem('cols', this.cols.toString());
    localStorage.setItem('asciiValue', this.asciiValue.toString());
  }
}
