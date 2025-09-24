import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ParkingSlot {
 id: string;
 vehicleType: string;
 availability : 'available' | 'occupied';
 status: 'available' | 'occupied';
}

@Component({
  selector: 'app-parking-slots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parking-slots.html',
  styleUrl: './parking-slots.css'
})
export class ParkingSlots {
   slots: ParkingSlot[] = [];

 constructor() {
  //  this.createSlots();
 }

 hoveredSlot : any | null = null;
 rows : string[] = [];
 cols = 0;
 asciiValue = 65;
 
 createSlots() {
  // this.slots;
  // this.rows = ['A','B','C'];
  let vehicleType = prompt("Enter vehicle type (2W or 4W):");
  if(vehicleType==='2W' || vehicleType==='4W'){
    
    // this.createSlots();
  
  if(this.cols === 10 || this.cols===0){
    const char =  String.fromCharCode(this.asciiValue)
    this.rows.push(char);
    this.cols = 0;
    this.asciiValue++;
  }
  this.cols = this.cols + 1;
  this.pushSlots(String(vehicleType));
  }else{
      alert("enter a valid vehicle type");
  }
 }

pushSlots(type : string){
  //  console.log(this.rows.slice(-1)[0] + this.cols)
    const text = this.rows.slice(-1)[0] + this.cols;
    this.slots.push({ id: text,vehicleType : type, availability : 'available',  status: 'available' });

}

 refreshSlots() {
  if(this.slots.length > 0){
    const removedSlot = this.slots.pop();

    if(this.cols === 1){
      this.rows.pop();
      this.asciiValue--;
      this.cols = 10;
    }else{
      this.cols--;
    }
  }else{
    alert("no slots to remove");
  }

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

}
