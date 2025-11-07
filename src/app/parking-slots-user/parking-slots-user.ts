import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { ParkingSlot } from '../model/parking-slots-module';
import { Router } from '@angular/router';


@Component({
  selector: 'app-parking-slots-user',
  imports: [CommonModule],
  templateUrl: './parking-slots-user.html',
  styleUrl: './parking-slots-user.css'
})
export class ParkingSlotsUser implements OnInit {

  @Output() onReserveEvent = new EventEmitter<string>();

 constructor(private parkkingSlotUserService : ParkingSlotsUserService,private route:Router) { }

 async ngOnInit(): Promise<void> {
    
    this.slots = this.parkkingSlotUserService.slots;
    this.tCount = await this.parkkingSlotUserService.getTcount();
    await this.fetchSlots();
  }


 slots : ParkingSlot[] = []
 hoveredSlot : any | null = null;
 tCount = 0;
 errorMessage: string = '';
 
//  createSlots() {
//  this.slots = this.parkkingSlotUserService.getCreateSlots();
//  }

//  refreshSlots() {
  // this.slots = this.parkkingSlotUserService.getRefreshSlots();
//  }
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

 async tcount(){
  this.tCount = await this.parkkingSlotUserService.getTcount();
 }

 showInfo(slot: ParkingSlot){
  this.hoveredSlot = slot;
 }
 hideInfo() : void{
  this.hoveredSlot = null;
 }

 onReserve(slot: ParkingSlot){
  this.onReserveEvent.emit(slot.slotName);
  console.log('Reserving slot:', this.hoveredSlot?.slotName);
  this.route.navigate(['/usersidenav/userreservation/reserveform', this.hoveredSlot?.slotName]);
 }
 

}
