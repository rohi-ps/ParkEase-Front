import { Component, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav-admin',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './sidenav-admin.html',
  styleUrl: './sidenav-admin.css'
})
export class SidenavAdmin {
  constructor(private authService:AuthService,private router: Router) {}
 isOpen = true; // Initial state is open

  @Output() toggleEvent = new EventEmitter<boolean>();
  @Output() items = new EventEmitter();

  toggle() {
    this.isOpen = !this.isOpen;
    this.toggleEvent.emit(this.isOpen);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }

}
