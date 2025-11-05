// import { Component, Output, EventEmitter } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { AuthService } from '../../Services/auth.service';
// declare var bootstrap: any;

// @Component({
//   selector: 'app-register',
//   imports: [FormsModule, CommonModule],
//   templateUrl: './register.html',
//   styleUrl: './register.css'
// })
// export class Register {
//   user = {
//     email: "",
//     firstname: "",
//     lastname: "",
//     password: "",
//     confirmPassword: ""
//   }

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}


//   closeModal() {
//     const modalElement = document.getElementById('registerModal');
//     if (modalElement) {
//       const modal = bootstrap.Modal.getInstance(modalElement);
//       if (modal) {
//         modal.hide();
//       }
//     }
//   }

//   passwordvalidate(pass: string): boolean {
//     const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//     return pattern.test(pass)
//   }

//   onSubmit(form: any) {
//     if (form.valid) {
//       if (!this.passwordvalidate(this.user.password)) {
//         alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
//         return;
//       }
      
//       if (this.user.password !== this.user.confirmPassword) {
//         alert('Password and Confirm Password do not match.');
//         return;
//       }

//       const success = this.authService.registerUser(this.user);
      
//       if (success) {
//         this.closeModal(); // Close the modal before navigation
//         alert('Registration successful! Please login.');
//         this.router.navigate(['/']);
//       } else {
//         alert('Registration failed. Email already exists.');
//       }
//     } else {
//       alert('Please complete all fields correctly.');
//     }
//   }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Login } from '../login/login';
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
 user = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  phone: ""
};


  constructor(private authService: AuthService, private router: Router) {}

  closeModal() {
    const modalElement = document.getElementById('registerModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }

  passwordvalidate(pass: string): boolean {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return pattern.test(pass);
  }
  phonevalidate(phone: string): boolean {
    const pattern = /^\d{10}$/;
    return pattern.test(phone);
  }

  onSubmit(form: any) {
    if (form.valid) {
      if (!this.passwordvalidate(this.user.password)) {
        alert('Password must be at least 8 characters long and include uppercase, lowercase, and a number.');
        return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }

    // Create payload without confirmPassword
 const payload = {
  email: this.user.email,
  firstName: this.user.firstName,
  lastName: this.user.lastName,
  password: this.user.password,
  confirmPassword: this.user.confirmPassword,
  phone: this.user.phone
};

console.log('Register payload:', payload);

   this.authService.registerUser(payload).subscribe({
  next: (res) => {
    if (res.success) {
      alert(res.message || 'Registration successful!');
      // this.closeModal();
      form.resetForm();

      this.router.navigate(['/']);
    } else {
      alert(res.message || 'Registration failed.');
    }
  },
  error: (err) => {
    console.error('Unexpected error:', err);
    alert('Something went wrong. Please try again.');
  }
});
  } else {
    alert('Please complete all fields correctly.');
  }
}

}
