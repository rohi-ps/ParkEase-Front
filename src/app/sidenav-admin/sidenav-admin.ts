import { Component, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-sidenav-admin',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './sidenav-admin.html',
  styleUrl: './sidenav-admin.css'
})
export class SidenavAdmin {
isOpen = true; // Initial state is open

  @Output() toggleEvent = new EventEmitter<boolean>();
  @Output() items = new EventEmitter();

  toggle() {
    this.isOpen = !this.isOpen;
    this.toggleEvent.emit(this.isOpen);
  }

  selectLink( item : string){
    this.items.emit(item);
  }
}
