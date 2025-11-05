// src/app/api.service.ts (Frontend)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParkingSlot } from '../model/parking-slots-module';
import { lastValueFrom } from 'rxjs';

// Define the base URL of your Express API
const API_URL = 'http://localhost:3000/api/v1/parking-spots'; // Use your actual endpoint URL

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  slots : ParkingSlot[] = [];
  constructor(private http: HttpClient) { }

  // 1. READ (GET) - Fetches all parking spots
  async getAllSpots(): Promise<any> {
    const observable = this.http.get(API_URL + '/');
    // Returns a Promise that resolves with the final data
    return lastValueFrom(observable); 
}
  

  // 2. CREATE (POST) - Adds a new parking spot
  addSpot(spotData: any): Observable<any> {
    return this.http.post(API_URL + '/', spotData);
  }

  // 3. DELETE
  deleteSpot(id: string): Observable<any> {
    return this.http.delete(API_URL + '/' + id);
  }
}