import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  @Output() loginSuccess = new EventEmitter<void>();
  
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

      const result = this.authService.authenticateUser(username, password);
      
      if (result.isAuthenticated) {
        this.loginSuccess.emit();
        this.closeModal(); // Close the modal before navigation
        
        if (result.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
          console.log('Navigating to admin dashboard');
        } else {
          this.router.navigate(['/user-dashboard']);
          console.log('Navigating to user dashboard');
        }
      } else {
        alert('Invalid username or password');
      }
    } else {
      console.warn('Form is invalid');
    }
  }
}
