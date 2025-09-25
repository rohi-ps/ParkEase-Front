import { Component} from '@angular/core';

import { UserComponent } from "./user-component/user-component";
import { DashboardComponent } from "./dashboard-admin/dashboard-admin";
import { SidenavComponent } from "./sidenav/sidenav";



@Component({
  selector: 'app-root',
  imports: [UserComponent, DashboardComponent, SidenavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isSidenavOpen = true;
  isDisplay = "Dashboard";
  isId = "";
  // isLoggedIn = false;

  // onUserLoggedIn() {
  //   this.isLoggedIn = true;
  // }

  

  onToggle(isOpen: boolean) {
    this.isSidenavOpen = isOpen;
  }

  onDisplayClicked(item : string){
    this.isDisplay = item;
  }

}
