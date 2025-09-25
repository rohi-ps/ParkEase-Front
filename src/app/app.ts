import { Component} from '@angular/core';

import { UserComponent } from "./user-component/user-component";
import { DashboardComponent } from "./dashboard-admin/dashboard-admin";
import { SidenavComponent } from "./sidenav/sidenav";
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [UserComponent, DashboardComponent, SidenavComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

 

}
