import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from './login/login';
import { Register } from './register/register';
// Import Bootstrap Modal
// import Modal from 'bootstrap/js/dist/modal';
@Component({
  selector: 'app-homepage',
  imports: [RouterModule,FormsModule,CommonModule,Login,Register],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  @Output() userLoggedIn = new EventEmitter<void>();

  onLoginSuccess() {
    // Close the modal
    this.userLoggedIn.emit();
    }
    // Emit the event to the parent component
  }
  // closeModal(id: string) {
  //   const modalEl = document.getElementById(id);
  //   if (modalEl) {
  //     const modalInstance = bootstrap.Modal.getInstance(modalEl);
  //     modalInstance?.hide();
  //   }
  // }

 

