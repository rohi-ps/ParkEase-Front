import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { ParkingSlot } from '../model/parking-slots-module';


@Component({
  selector: 'app-parking-slots-user',
  imports: [CommonModule],
  templateUrl: './parking-slots-user.html',
  styleUrl: './parking-slots-user.css'
})
export class ParkingSlotsUser implements OnInit {

  @Output() onReserveEvent = new EventEmitter<void>();
  @Output() onBookEvent = new EventEmitter<void>();

 constructor() {
  //  this.createSlots();
 }

 ngOnInit(): void {
    
    this.slots = this.parkkingSlotUserService.slots;
    this.tCount = this.parkkingSlotUserService.getTcount();

  }

 private parkkingSlotUserService = inject(ParkingSlotsUserService);

 slots : ParkingSlot[] = []
 hoveredSlot : any | null = null;
 tCount = 0;
 
 createSlots() {
 this.slots = this.parkkingSlotUserService.getCreateSlots();
 this.tcount();
 }

// pushSlots(type : string){
  
//     const text = this.rows.slice(-1)[0] + this.cols;
//     this.slots.push({ id: text,vehicleType : type, availability : 'available',  status: 'available' });
// }

 refreshSlots() {
  this.slots = this.parkkingSlotUserService.getRefreshSlots();
  this.tcount();
 }

 tcount(){
  this.tCount = this.parkkingSlotUserService.getTcount();
 }
 toggleSlot(slot: ParkingSlot) {
   slot.status = slot.status === 'available' ? 'occupied' : 'available';
 }

 showInfo(slot: ParkingSlot){
  this.hoveredSlot = slot;
 }
 hideInfo() : void{
  this.hoveredSlot = null;
 }

 onBook(){
  this.onBookEvent.emit();
 }
 onReserve(){
  this.onReserveEvent.emit();
 }

}
