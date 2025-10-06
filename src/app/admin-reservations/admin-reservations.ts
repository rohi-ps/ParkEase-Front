import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SlotReservationForm } from './slot-reservation-form/slot-reservation-form';
import { CustomerService } from '../Services/customer-service';
import { ModifyReservationForm } from './modify-reservation-form/modify-reservation-form';
import { Customer } from '../model/customers';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
@Component({
  selector: 'app-admin-reservations',
  imports: [FormsModule,CommonModule,ModifyReservationForm,SlotReservationForm],
  templateUrl: './admin-reservations.html',
  styleUrl: './admin-reservations.css'
})
export class AdminReservations {
  customers: any[] = []
  selectedStatus = 'All Status';
  constructor(private cs: CustomerService, private parkingSlotsService: ParkingSlotsUserService) {
  }
  ngOnInit(): void {
    this.customers = this.cs.getallUsers();
  }
  searchTerm: string = '';
  filteredCustomers(): any[] {
    this.customers = this.cs.getallUsers();
    return this.customers.filter(customer => {
      const matchesStatus = this.selectedStatus === 'All Status' || customer.status.toLowerCase() === this.selectedStatus.toLowerCase();
      const matchesSearch = !this.searchTerm || customer.slotId.toLowerCase().includes(this.searchTerm.toLowerCase()) || customer.vehicleNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
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
  deletecustomer(id: number) {
    const customerToUpdate = this.customers.find(c => c.id === id);
    if (customerToUpdate) {
      customerToUpdate.status = 'Cancelled';
      this.parkingSlotsService.updateSlotStatus(customerToUpdate.slotId, 'available');
    }
  }
  selectedCustomer: Customer | null = null;
  onEdit(customer: Customer) {
    this.selectedCustomer = { ...customer }; 
  }
}

