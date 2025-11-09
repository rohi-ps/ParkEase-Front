import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../Services/billing.service';
import { Rate } from '../model/billing.model';

@Component({
  selector: 'app-rate-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rate-management.html',
  styleUrl: './rate-management.css'
})
export class RateManagement implements OnInit {
  rates: Rate[] = [];
  showCreateRateModal = false;
  editingRate: Rate | null = null;
  newRate = {
    vehicleType: '2W',
    baseRate: 0,
    additionalHourRate: 0
  };
  error: string = '';
  success: string = '';

  constructor(private billingService: BillingService) {}

  ngOnInit(): void {
    this.loadRates();
  }

  loadRates(): void {
    this.billingService.getRates().subscribe({
      next: (response) => {
        this.rates = response.data;
        // Check if both 2W and 4W rates exist
        const has2W = this.rates.some(rate => rate.vehicleType === '2W');
        const has4W = this.rates.some(rate => rate.vehicleType === '4W');
        
        if (!has2W || !has4W) {
          this.showCreateRateModal = true;
          this.error = 'Please configure rates for both 2-Wheeler and 4-Wheeler parking.';
          
          // Set the missing vehicle type as default
          if (!has2W) {
            this.newRate.vehicleType = '2W';
          } else if (!has4W) {
            this.newRate.vehicleType = '4W';
          }
        }
      },
      error: (err) => {
        console.error('Error fetching rates:', err);
        this.error = 'Failed to load rates. Please try again.';
      }
    });
  }

  openCreateRateModal(): void {
    this.showCreateRateModal = true;
    this.editingRate = null;
    this.newRate = {
      vehicleType: '2W',
      baseRate: 0,
      additionalHourRate: 0
    };
  }

  closeModal(): void {
    this.showCreateRateModal = false;
    this.editingRate = null;
    this.error = '';
    this.success = '';
  }

  createRate(): void {
    if (this.newRate.baseRate <= 0 || this.newRate.additionalHourRate <= 0) {
      this.error = 'Rates must be greater than 0';
      return;
    }

    // Check if rate already exists for this vehicle type
    if (this.rates.some(rate => rate.vehicleType === this.newRate.vehicleType)) {
      this.error = `Rate for ${this.newRate.vehicleType} already exists. Please use edit instead.`;
      return;
    }

    this.billingService.createRate(this.newRate).subscribe({
      next: (response) => {
        this.loadRates();
        // Only close modal if both vehicle types have rates
        const updatedRates = [...this.rates, response.data];
        const has2W = updatedRates.some(rate => rate.vehicleType === '2W');
        const has4W = updatedRates.some(rate => rate.vehicleType === '4W');
        
        if (has2W && has4W) {
          this.showCreateRateModal = false;
          this.success = 'All required rates are now configured!';
        } else {
          this.success = 'Rate created successfully! Please configure rate for other vehicle type.';
          // Set the remaining vehicle type
          this.newRate.vehicleType = this.newRate.vehicleType === '2W' ? '4W' : '2W';
          this.newRate.baseRate = 0;
          this.newRate.additionalHourRate = 0;
        }
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error('Error creating rate:', err);
        this.error = 'Failed to create rate. Please try again.';
      }
    });
  }

  editRate(rate: Rate): void {
    this.editingRate = rate;
    this.newRate = {
      vehicleType: rate.vehicleType,
      baseRate: rate.baseRate,
      additionalHourRate: rate.additionalHourRate
    };
    this.showCreateRateModal = true;
  }

  updateRate(): void {
    if (!this.editingRate) return;

    if (this.newRate.baseRate <= 0 || this.newRate.additionalHourRate <= 0) {
      this.error = 'Rates must be greater than 0';
      return;
    }

    this.billingService.updateRate(this.editingRate.vehicleType, {
      baseRate: this.newRate.baseRate,
      additionalHourRate: this.newRate.additionalHourRate
    }).subscribe({
      next: (response) => {
        this.loadRates();
        this.showCreateRateModal = false;
        this.success = 'Rate updated successfully!';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error('Error updating rate:', err);
        this.error = 'Failed to update rate. Please try again.';
      }
    });
  }
}
