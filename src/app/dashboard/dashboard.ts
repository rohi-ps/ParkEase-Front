import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidenavComponent } from "../sidenav/sidenav";
import { DashboardUser } from "../dashboard-user/dashboard-user";
import {  DashboardComponent } from "../dashboard-admin/dashboard-admin";
import { AuthService } from "../Services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidenavComponent, DashboardUser, DashboardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  isSidenavOpen = true;
  isDisplay = "Dashboard";
  isId = "";
  userRole: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUserRole();
    if (!this.userRole) {
      // If no user role is found, redirect to login
      this.router.navigate(['/']);
    }
  }

  onToggle(isOpen: boolean) {
    this.isSidenavOpen = isOpen;
  }

  onDisplayClicked(item: string) {
    this.isDisplay = item;
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }
}
