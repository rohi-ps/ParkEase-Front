import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user = {
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    cpassword: ""
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  closeModal() {
    const modalElement = document.getElementById('registerModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  passwordvalidate(pass: string): boolean {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return pattern.test(pass)
  }

  onSubmit(form: any) {
    if (form.valid) {
      if (!this.passwordvalidate(this.user.password)) {
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
        return;
      }
      
      if (this.user.password !== this.user.cpassword) {
        alert('Password and Confirm Password do not match.');
        return;
      }

      const success = this.authService.registerUser(this.user);
      
      if (success) {
        this.closeModal(); // Close the modal before navigation
        alert('Registration successful! Please login.');
        this.router.navigate(['/']);
      } else {
        alert('Registration failed. Email already exists.');
      }
    } else {
      alert('Please complete all fields correctly.');
    }
  }
}
