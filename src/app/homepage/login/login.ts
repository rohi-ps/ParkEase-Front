// import { Component, Output, EventEmitter } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { AuthService } from '../../Services/auth.service';
// declare var bootstrap: any;

// @Component({
//   selector: 'app-login',
//   imports: [FormsModule, CommonModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login {
  
//   user = {
//     email: "",
//     password: ""
//   };

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   closeModal() {
//     const modalElement = document.getElementById('loginModal');
//     if (modalElement) {
//       const modal = bootstrap.Modal.getInstance(modalElement);
//       if (modal) {
//         modal.hide();
//       }
//     }
//   }

  // onSubmit(form: any) {
  //   if (form.valid) {
  //     const username = this.user.email;
  //     const password = this.user.password;

  //     const result = this.authService.authenticateUser(username, password);
      
  //     if (result.isAuthenticated) {
  //       this.closeModal(); // Close the modal before navigation
        
  //       if (result.role === 'admin') {
  //         this.router.navigate(['adminsidenav']);
  //         console.log('Navigating to admin dashboard');
  //       } else {
  //         this.router.navigate(['usersidenav']);
  //         console.log('Navigating to user dashboard');
  //       }
  //     } else {
  //       alert('Invalid username or password');
  //     }
  //   } else {
  //     console.warn('Form is invalid');
  //   }
  // }
// onSubmit(form: any) {
//   if (form.valid) {
//     this.authService.authenticateUser(this.user.email, this.user.password).subscribe({
//       next: (res) => {
//         if (res.isAuthenticated) {
//           const token = this.authService.getToken(); // Get stored token
//           const role = this.authService.decodeToken()?.role || '';

//           this.closeModal();

//           if (role === 'admin') {
//             this.router.navigate(['adminsidenav']);
//           } else {
//             this.router.navigate(['usersidenav']);
//           }
//         } else {
//           alert('Invalid username or password');
//         }
//       },
//       error: () => {
//         alert('Login failed due to an error');
//       }
//     });
//   } else {
//     console.warn('Form is invalid');
//   }
// }



//  }
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
declare var bootstrap: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  user = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}
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
      this.authService.authenticateUser(this.user.email, this.user.password).subscribe({
  next: (res) => {
    console.log('Login response:', res);
    if (res.token) {
      this.authService.storeToken(res.token);
      const role = this.authService.decodeToken()?.role || '';
      this.closeModal();
      if (role === 'admin') {
        this.router.navigate(['adminsidenav']);
      } else {
        this.router.navigate(['usersidenav']);
      }
    } else {
      this.authService.clearToken();
      alert('Invalid credentials');
    }
  },
  error: () => {
    this.authService.clearToken();
    alert('Login failed due to an error');
  }
})}}
}