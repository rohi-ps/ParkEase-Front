import { Component,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user={
    email:"",
    firstname:"",
    lastname:"",
    password:"",
    cpassword:""
  }
  passwordvalidate(pass: string): boolean {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return pattern.test(pass)
  }
  onSubmit(form:any){
    if (form.valid) {
      if(!this.passwordvalidate(this.user.password)){
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
        return;
      }
      if(this.user.password !== this.user.cpassword){
        alert('Password and Confirm Password do not match.');
        return;
      }
      console.log('Register data:', form.value);
    } else {
      console.warn('Complete all fields');
    }
  }
  }
