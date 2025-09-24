import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  @Output() loginSuccess = new EventEmitter<void>();
  
  user={
  email: "",
  password:""
  }
  onSubmit(form:any) {
   if (form.valid) {
    const email = this.user.email;
    const password = this.user.password;
    const domain = email.split('@')[1];

    this.loginSuccess.emit();
    const adminDomains = ['company.com', 'admin.com'];
    const isAdmin = adminDomains.includes(domain);

    if (isAdmin) {
      alert('Logged in as Admin');
    } else {
      alert('Logged in as Normal User');
    }

    console.log('Login data:', form.value);
  } else {
    console.warn('Form is invalid');
  }
  }
}
