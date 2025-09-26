import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(private router:Router){}
  user={
  email: "",
  password:""
  }
onSubmit(form: any) {
  if (form.valid) {
    const email = this.user.email;
    const domain = email.split('@')[1];

    const adminDomains = ['company.com', 'admin.com'];
    const isAdmin = adminDomains.includes(domain);

    if (isAdmin) {
      this.router.navigate(['/nav/userdashboard']).then(() => {
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.remove();
  document.body.classList.remove('modal-open');
});
    } else {
      alert('Logged in as Normal User');
    }

    console.log('Login data:', form.value);
  } else {
    console.warn('Form is invalid');
  }
}

   
}
