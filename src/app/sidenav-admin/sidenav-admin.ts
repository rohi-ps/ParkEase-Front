import { Component, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav-admin',
  imports: [CommonModule],
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
