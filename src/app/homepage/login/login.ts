import { Component } from '@angular/core';
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
        // console.log('Login response:', res);

        if (res.token) {
          this.authService.storeToken(res.token); 
          // this.closeModal(); 

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
  console.error('Unexpected error:', err);
  const validationErrors = err?.error?.errors;
  if (Array.isArray(validationErrors)) {
    const messages = validationErrors.map(e => e.msg).join('\n');
    alert(messages);
  } else {
    const fallback = err?.error?.message || 'Registration failed.';
    alert(fallback);
  }
    }
  }) }else {
    console.warn('Form is invalid');
  }
}}