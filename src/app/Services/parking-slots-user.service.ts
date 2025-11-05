import { Injectable } from '@angular/core';
import { ParkingSlot, ApiResponse } from '../model/parking-slots-module';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';


// Define the base URL of your Express API
const API_URL = 'http://localhost:3000/api/v1/parking-spots'; // Use your actual endpoint URL


@Injectable({
  providedIn: 'root',
})
export class ParkingSlotsUserService {
  slots: ParkingSlot[] = [];
  rows: string[] = [];
  cols = 0;
  asciiValue = 65;
  tAvailCount = 0;
  tReserveCount = 0;

  constructor(private http: HttpClient) {
    this.tAvailCount = this.slots.filter(slot => slot.status === 'available').length;
    this.tReserveCount = this.slots.filter(slot => slot.status === 'occupied').length;
  }


async getCreateSlots(): Promise<ParkingSlot[] | undefined> {
    const vehicleType = prompt('Enter vehicle type (2W or 4W):');

    if (vehicleType === '2W' || vehicleType === '4W') {
        if (this.cols === 50 || this.cols === 0) {
            const char = String.fromCharCode(this.asciiValue);
            this.rows.push(char);
            this.cols = 0;
            this.asciiValue++;
        }
        this.cols = this.cols + 1;
        this.tAvailCount = this.slots.filter(slot => slot.status === 'available').length;
        this.tReserveCount = this.slots.filter(slot => slot.status === 'occupied').length;

        // 2. Await the function call and return the Promise's result
        return this.getPushSlots(String(vehicleType)); 
    } else {
        alert('Enter a valid vehicle type');
        // 3. Explicitly return a resolved Promise with undefined (or throw error)
        return Promise.resolve(undefined);
    }
}

// Keep this function returning an Observable, but use it inside getCreateSlots
getPushSlots(type: string): Promise<ParkingSlot[]> { 
    const text = this.rows.slice(-1)[0] + this.cols;
    this.slots.push({
        slotName: text,
        vehicleType: type,
        status: 'available',
    });
    // Use lastValueFrom to return a Promise instead of Observable
    return lastValueFrom(
        this.http.post<ParkingSlot[]>("http://localhost:3000/api/v1/parking-spots", {
            slotName: text,
            vehicleType: type,
            status: 'available'
        })
    );
}

 //Getting all slots
 async getAllSlots(): Promise<ParkingSlot[]> {
    const observable = this.http.get<ApiResponse>(API_URL + '/'); // <-- Use ApiResponse here
    
    try {
        // Use lastValueFrom to await the Promise
        const response = await lastValueFrom(observable); 
        // TypeScript now confirms that 'response' is an ApiResponse, 
        // which definitely has the 'data' property.
        return response.data; // <-- TS2339 error is gone
    } catch (error) {
        throw error;
    }
}
   // --- NEW METHOD ---
  // Returns only the slots that are currently available.
    getAvailableSlots():ParkingSlot[] {
    return this.slots.filter(slot => slot.status === 'available');
    // const observable = this.http.get<ApiResponse>(API_URL + '/'); // <-- Use ApiResponse here
    
    // try {
    //     // Use lastValueFrom to await the Promise
    //     const response = await lastValueFrom(observable); 
    //     const availableSlots = response.data.filter(slot => slot.status === 'available');
    //     return availableSlots; // <-- TS2339 error is gone
    // } catch (error) {
    //     throw error;
    // }
  }

  // --- NEW METHOD ---
  // Finds a slot by its ID and updates its status.
  updateSlotStatus(slotId: string, newStatus: 'available' | 'occupied'): void {
    const slotToUpdate = this.slots.find(slot => slot.slotName === slotId);
    if (slotToUpdate) {
      slotToUpdate.status = newStatus;
      // this.saveTasks(); 
      console.log(`Slot ${slotId} status updated to ${newStatus}`);
    } else {
      console.error(`Could not find slot with ID: ${slotId} to update.`);
    }
  }

  updateSlot(updatedSlot: ParkingSlot) {
  return lastValueFrom(this.http.put<ApiResponse>(
    `${API_URL}/${updatedSlot.slotName}/status`,
    {status: updatedSlot.status}
  ));  

    
  }

  async getRefreshSlots( id: string): Promise<void> {

      if (this.cols === 1) {
        this.rows.pop();
        this.asciiValue--;
        this.cols = 50;
      } else {
        this.cols--;
      }
    return lastValueFrom(this.http.delete<void>(`${API_URL}/${id}`));

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
