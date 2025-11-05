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
  
    ngOnInit(): void {
    
    this.slots = this.parkkingSlotUserService.slots;
  }

 constructor(private parkkingSlotUserService : ParkingSlotsUserService, private route:Router) {
  //  this.createSlots();
 }


 hoveredSlot : any | null = null;
 rows : string[] = [];
 cols = 0;
 asciiValue = 65;
 
 createSlots() {
    this.slots = this.parkkingSlotUserService.getCreateSlots();
 }

// pushSlots(type : string){
 

// }

 refreshSlots() {
 this.slots = this.parkkingSlotUserService.getRefreshSlots();
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
