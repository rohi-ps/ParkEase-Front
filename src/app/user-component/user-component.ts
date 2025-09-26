import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from "../sidenav/sidenav";
import { DashboardUser } from "../dashboard-user/dashboard-user";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, SidenavComponent, DashboardUser],
  template: `
    <div class="user-container">
      <app-sidenav (toggleEvent)="onToggle($event)" (items)="onDisplayClicked($event)"></app-sidenav>
      <div class="main-content" [class.shifted]="isSidenavOpen">
        <app-dashboard-user></app-dashboard-user>
      </div>
    </div>
  `,
  styles: [`
    .user-container {
      display: flex;
      height: 100vh;
      background-color: #f8f9fa;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      transition: margin-left 0.3s ease;
      overflow-y: auto;
    }

    .main-content.shifted {
      margin-left: 250px;
    }

    @media (max-width: 768px) {
      .main-content.shifted {
        margin-left: 0;
      }
    }
  `]
})
export class UserComponent {
  isSidenavOpen = true;
  isDisplay = "Dashboard";

  onToggle(isOpen: boolean) {
    this.isSidenavOpen = isOpen;
  }

  onDisplayClicked(item: string) {
    this.isDisplay = item;
  }
}
