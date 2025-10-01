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

  @Output() onReserveEvent = new EventEmitter<string>();

 constructor(private parkkingSlotUserService : ParkingSlotsUserService) { }

 ngOnInit(): void {
    
    this.slots = this.parkkingSlotUserService.slots;
    this.tCount = this.parkkingSlotUserService.getTcount();

  }


 slots : ParkingSlot[] = []
 hoveredSlot : any | null = null;
 tCount = 0;
 
 createSlots() {
 this.slots = this.parkkingSlotUserService.getCreateSlots();
 }

 refreshSlots() {
  this.slots = this.parkkingSlotUserService.getRefreshSlots();
 }

 tcount(){
  this.tCount = this.parkkingSlotUserService.getTcount();
 }

 showInfo(slot: ParkingSlot){
  this.hoveredSlot = slot;
 }
 hideInfo() : void{
  this.hoveredSlot = null;
 }

 onReserve(slot: ParkingSlot){
  this.onReserveEvent.emit(slot.id);
 }

}
