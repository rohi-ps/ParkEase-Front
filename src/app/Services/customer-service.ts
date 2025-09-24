import { Injectable } from '@angular/core';
import { Customer } from '../model/customers';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(){}
  customers: Customer[] = [
    {
      id: 1,
      slotId: 'A101',
      vehicleNumber: 'TN09AB1234',
      vehicleType: '2W',
      entryDate: '2025-09-22',
      entryTime: '09:00',
      exitDate: '2025-09-22',
      exitTime: '11:00', 
      status: 'Upcoming'
    },
    {
      id: 2,
      slotId: 'B202',
      vehicleNumber: 'TN10XY5678',
      vehicleType: '4W',
      entryDate: '2025-09-22',
      entryTime: '10:30',
      exitDate: '2025-09-22',
      exitTime: '13:00',
      status: 'Active'
    },
    {
      id: 3,
      slotId: 'C303',
      vehicleNumber: 'TN11CD9012',
      vehicleType: '2W',
      entryDate: '2025-09-21',
      entryTime: '15:00',
      exitDate: '2025-09-21',
      exitTime: '17:30',
      status: 'Completed'
    },
    {
      id: 4,
      slotId: 'D404',
      vehicleNumber: 'TN12EF3456',
      vehicleType: '4W',
      entryDate: '2025-09-20',
      entryTime: '08:00',
      exitDate: '2025-09-20',
      exitTime: '10:00',
      status: 'cancelled'
    }
  ];
  getallUsers(){
    return this.customers
  }
  addtocustomer(slotId : string, vehicleNumber : string, vehicleType : string, entryDate:string, entryTime:string, exitDate:string, exitTime:string,status:string="Upcoming"){
    this.customers.push({id: this.customers.length + 1,slotId,vehicleNumber,vehicleType,entryDate,entryTime,exitDate,exitTime,status
    });
  }
  


}
