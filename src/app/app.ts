import { Component} from '@angular/core';

import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

<<<<<<< HEAD
  isSidenavOpen = true;
  isDisplay = "Dashboard";
  isId = "#";
  // isLoggedIn = false;

  // onUserLoggedIn() {
  //   this.isLoggedIn = true;
  // }

  parkingEvent() {
    this.isDisplay = "Find Parking";
  }
  bookEvent(data : string){
    this.isDisplay = "Vehicle logs";
    this.isId = data;

  }
  reserveEvent(data : string){
    this.isDisplay = "My Reservation";
    this.isId = data;
  }

  onToggle(isOpen: boolean) {
    this.isSidenavOpen = isOpen;
  }

  onDisplayClicked(item : string){
    this.isDisplay = item;
  }
=======
 
>>>>>>> main

}
