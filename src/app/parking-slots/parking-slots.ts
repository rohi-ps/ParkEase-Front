import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { Router } from '@angular/router';
import { ParkingSlot } from '../model/parking-slots-module';


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
  isLoading: boolean = true;
  errorMessage: string = '';
  
  async ngOnInit(): Promise<void> {
    
    this.slots = await this.parkkingSlotUserService.getAllSlots();
    await this.fetchSlots();
    this.isLoading = false;
  }

 constructor(private parkkingSlotUserService : ParkingSlotsUserService, private route:Router) {
  //  this.createSlots();
 }


 hoveredSlot : any | null = null;
 rows : string[] = [];
 cols = 0;
 asciiValue = 65;
 // src/app/parking-slots-user/parking-slots-user.ts (Component)

// Make the function asynchronous
async createSlots() {
    try {
        // Use await to get the resolved value (ParkingSlot[] or undefined)
        const newSlots = await this.parkkingSlotUserService.getCreateSlots(); 
        
        // Only update slots if newSlots is not undefined (i.e., if validation passed)
        if (newSlots) { 
            this.slots = newSlots;
            await this.fetchSlots();
            // You might need to reload your entire slot list here if the response
            // only returns the created slot, not the full list.
        }
    } catch (error) {
        console.error('Error creating slots:', error);
        // Handle network or server errors
    }
}

// pushSlots(type : string){
 
//fetching slots from service
async fetchSlots(): Promise<void> {
    try {
      // Await the promise from the service, which returns the array
      this.slots = await this.parkkingSlotUserService.getAllSlots(); 
      console.log('Slots loaded:', this.slots);
    } catch (error) {
      this.errorMessage = 'Could not load parking slots.';
      console.error(error);
    }
  }

// }

 async refreshSlots(): Promise<void> {
 try {
        // 1. Fetch the full list of slots (or whatever your service returns)
        const allSlots = await this.parkkingSlotUserService.getAllSlots(); 
        
        // --- ADD/REINFORCE THIS CHECK ---
        if (!allSlots || allSlots.length === 0) {
            console.log('No slots found to delete. Array is empty.');
            alert('The parking lot is empty! Cannot delete.');
            return; // EXIT the function immediately
        }

        const lastSlot = allSlots[allSlots.length - 1];
        const slotIdToDelete = lastSlot.slotName; // Assuming slotName is the identifier

        // 4. SEND DELETE REQUEST
        await this.parkkingSlotUserService.getRefreshSlots(slotIdToDelete);

        // 5. REFRESH THE UI
        await this.fetchSlots(); 

    } catch (error) {
        console.error('Error deleting slot:', error);
        alert('Failed to delete the last slot.');
    }
 }
 toggleSlot(slot: ParkingSlot) {
   slot.status = slot.status === 'available' ? 'occupied' : 'available';
   this.parkkingSlotUserService.updateSlot(slot);   
 }

 showInfo(slot: ParkingSlot){
  this.hoveredSlot = slot;
 }
 hideInfo() : void{
  this.hoveredSlot = null;
 }
 
  onBook(slot: ParkingSlot){
   this.onBookEvent.emit(slot.slotName);
   this.route.navigateByUrl('adminsidenav/vehiclelogs')
  }
}
