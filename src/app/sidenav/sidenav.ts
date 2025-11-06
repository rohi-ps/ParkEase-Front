import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';



@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css']
})
export class SidenavComponent {
  constructor(private router: Router) {}
  isOpen = true; // Initial state is open

  @Output() toggleEvent = new EventEmitter<boolean>();

  @Output() items = new EventEmitter();

  toggle() {
    this.isOpen = !this.isOpen;
    this.toggleEvent.emit(this.isOpen);
  }

  selectLink( item : string){
    // console.log(item);
    this.items.emit(item);
  }
  logout() {
    this.router.navigate(['/']);
  }
}
