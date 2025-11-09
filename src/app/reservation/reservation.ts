import { Component,OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SlotReservationForm } from "./slot-reservation-form/slot-reservation-form";
import { CustomerService } from '../Services/customer-service';
import { ModifyReservation } from './modify-reservation/modify-reservation';
import { Customer } from '../model/customers';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reservation',
  imports: [FormsModule, CommonModule, SlotReservationForm, ModifyReservation, RouterOutlet],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css'
})
export class Reservation implements OnInit {
 
  customers: any[] = []
  selectedStatus = 'All Status';
  constructor(private cs: CustomerService,private router: Router) {
  }
  ngOnInit(): void {
  this.loadCustomers();
}
  searchTerm: string = '';
  filteredCustomers(): any[] {
  return this.customers.filter(customer => {
    const matchesStatus = this.selectedStatus === 'All Status' || customer.status.toLowerCase() === this.selectedStatus.toLowerCase();
    const matchesSearch = !this.searchTerm || customer.slotId.toLowerCase().includes(this.searchTerm.toLowerCase()) || customer.vehicleNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
}
loadCustomers(): void {
  this.cs.getallUsers().subscribe({
    next: (data) => this.customers = data,
    error: (err) => console.error('Failed to load customers', err)
  });
}
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'status-upcoming';
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'fas fa-clock';
      case 'active':
        return 'fas fa-bolt';
      case 'completed':
        return 'fas fa-circle-check';
      case 'cancelled':
        return 'fas fa-times-circle';
      default:
        return '';
    }
  }
 deletecustomer(id: number): void {
  this.cs.cancelReservation(id).subscribe({
    next: () => {
      const customerToUpdate = this.customers.find(user => user.id === id);
      if (customerToUpdate) {
        customerToUpdate.status = 'Cancelled';
      }
    },
    error: (err) => console.error('Failed to cancel reservation', err)
  });
}
 
  selectedCustomer: Customer | null = null;
  onEdit(customer: Customer) {
    this.selectedCustomer = { ...customer };
  }
  goToForm(): void {
  this.router.navigate(['/usersidenav/userreservation/reserveform']);
}
}