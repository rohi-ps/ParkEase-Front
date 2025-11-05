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
  asciiValue = 65; // Starts at 'A'
  tAvailCount = 0;
  tReserveCount = 0;

  constructor() {
    // Initialize the service with a predefined set of static slots
    this._initializeStaticData();
  }

  /**
   * Populates the service with a default set of parking slots using the simplified model.
   */
  private _initializeStaticData(): void {
    // Each object now correctly has only id, vehicleType, and status.
    this.slots = [
      // --- Row A ---
      { id: 'A1', vehicleType: '4W', status: 'available' },
      { id: 'A2', vehicleType: '4W', status: 'occupied' },
      { id: 'A3', vehicleType: '4W', status: 'available' },
      { id: 'A4', vehicleType: '2W', status: 'available' },

      // --- Row B ---
      { id: 'B1', vehicleType: '2W', status: 'occupied' },
      { id: 'B2', vehicleType: '2W', status: 'occupied' },
      { id: 'B3', vehicleType: '2W', status: 'available' },
      { id: 'B4', vehicleType: '4W', status: 'available' },
      { id: 'B5', vehicleType: '4W', status: 'available' },
      { id: 'B6', vehicleType: '4W', status: 'available' },

      // --- Row C ---
      { id: 'C1', vehicleType: '2W', status: 'available' },
      { id: 'C2', vehicleType: '2W', status: 'available' },
      { id: 'C3', vehicleType: '4W', status: 'occupied' },
      { id: 'C4', vehicleType: '2W', status: 'available' },
      { id: 'C5', vehicleType: '4W', status: 'available' },
    ];

    // Update service state to match the static data
    this.rows = ['A', 'B', 'C'];
    this.cols = 5;
    this.asciiValue = 68; // Next char is 'D'

    // Calculate initial counts
    this.updateCounts();
  }

  getCreateSlots() {
    let vehicleType = prompt('Enter vehicle type (2W or 4W):');
    if (vehicleType === '2W' || vehicleType === '4W') {
      if (this.cols === 10) {
        const char = String.fromCharCode(this.asciiValue);
        this.rows.push(char);
        this.cols = 0;
        this.asciiValue++;
      }
      this.cols = this.cols + 1;
      this.getPushSlots(vehicleType);
    } else {
      alert('Enter a valid vehicle type');
    }
    this.updateCounts();
    return this.slots;
  }

  getPushSlots(type: string) {
    const text = this.rows.slice(-1)[0] + this.cols;
    this.slots.push({
      id: text,
      vehicleType: type,
      status: 'available',
    });
  }

  getAvailableSlots(): ParkingSlot[] {
    return this.slots.filter(slot => slot.status === 'available');
  }
  
  getAllSlots(): ParkingSlot[] {
    return this.slots;
  }

  updateSlotStatus(slotId: string, newStatus: 'available' | 'occupied'): void {
    const slotToUpdate = this.slots.find(slot => slot.id === slotId);
    if (slotToUpdate) {
      slotToUpdate.status = newStatus;
      this.updateCounts();
      console.log(`Slot ${slotId} status updated to ${newStatus}`);
    } else {
      console.error(`Could not find slot with ID: ${slotId} to update.`);
    }
  }

  getRefreshSlots() {
    if (this.slots.length > 0) {
      this.slots.pop();
      if (this.cols === 1) {
        if (this.rows.length > 1) {
            this.rows.pop();
            this.asciiValue--;
            this.cols = 10;
        } else {
            this.cols = 0;
        }
      } else {
        this.cols--;
      }
    } else {
      alert('No slots to remove');
    }
    this.updateCounts();
    return this.slots;
  }

  getTcount() {
    return this.tAvailCount;
  }

  getOccupiedSlots() {
    return this.tReserveCount;
  }

  private updateCounts() {
    this.tAvailCount = this.slots.filter(
      slot => slot.status === 'available'
    ).length;
    this.tReserveCount = this.slots.filter(
      slot => slot.status === 'occupied'
    ).length;
  }
}