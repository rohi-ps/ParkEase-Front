import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { RouterLink } from "@angular/router";
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  user = {
    email: "",
    password: ""
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  closeModal() {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  onSubmit(form: any) {
  if (form.valid) {
    const username = this.user.email;
    const password = this.user.password;

    this.authService.authenticateUser(username, password).subscribe({
      next: (res) => {
        console.log('Login response:', res);

        if (res.token) {
          this.authService.storeToken(res.token); // Save token
          this.closeModal(); // Close modal

          if (res.role === 'admin') {
            this.router.navigate(['adminsidenav']);
            console.log('Navigating to admin dashboard');
          } else {
            this.router.navigate(['usersidenav']);
            console.log('Navigating to user dashboard');
          }
        } else {
          alert('Invalid login response');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Invalid username or password');
      }
    });
  } else {
    console.warn('Form is invalid');
  }
}
}