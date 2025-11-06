import { Injectable } from '@angular/core';
import { vehicleLog } from '../model/vehicleLog';
import { UserSearchResult } from '../model/user-search';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ParkingSlot } from '../model/parkingSlot';
@Injectable({
  providedIn: 'root'
})

export class Parkingservice {
  private readonly apiUrl = 'http://localhost:3000/api'; 

// --- Data streams (reactive) ---
  private readonly _parkingRecords = new BehaviorSubject<vehicleLog[]>([]);
  public readonly parkingRecords$: Observable<vehicleLog[]> = this._parkingRecords.asObservable();

  constructor(private http: HttpClient) {
    this.fetchParkingRecords();
  }
 
    // --- DATA FETCHING METHODS ---
  //For Admin only
  public fetchParkingRecords(): void {
    this.http.get<vehicleLog[]>(`${this.apiUrl}/logs`)
      .pipe(catchError(this.handleError))
      .subscribe(records => this._parkingRecords.next(records));
  }
  
   //Gets all logs for the currently logged-in user.
   
  public getMyVehicleLogs(): Observable<vehicleLog[]> {
    return this.http.get<vehicleLog[]>(`${this.apiUrl}/logs/my-logs`)
      .pipe(catchError(this.handleError));

  }
  
  // --- DATA MUTATION METHODS ---

 public logEntry(logData: {
    vehicleNumber: string;
    vehicleType: '4W' | '2W';
    customerName: string;
    slotId: string; 
    userId: string | null; 
  }): Observable<vehicleLog> {
    
    return this.http.post<vehicleLog>(`${this.apiUrl}/logs`, logData)
      .pipe(
        tap((newLog) => {
          // On success, refresh the main log list
          this.fetchParkingRecords();
          // We don't refresh invoices, as no invoice is created on entry
        }),
        catchError(this.handleError)
      );
  }

 
  public logExit(vehicleNumber: string): Observable<vehicleLog> {
    return this.http.patch<vehicleLog>(`${this.apiUrl}/logs/exit`, { vehicleNumber })
      .pipe(
        tap((updatedLog) => {
          // On success, refresh BOTH lists, as an invoice was just created
          this.fetchParkingRecords();
        }),
        catchError(this.handleError)
      );
  }

  
  
   // Fetches only the available parking slots from the API.
   
  public getAvailableSlots(): Observable<ParkingSlot[]> {
    return this.http.get<ParkingSlot[]>(`${this.apiUrl}/v1/parking-spots/available-slots`)
      .pipe(catchError(this.handleError));
  }
  //search user by phone number
  public searchUsersByPhone(phone: string): Observable<UserSearchResult[]> {
    if (!phone || phone.trim().length < 3) {
      return new BehaviorSubject<UserSearchResult[]>([]).asObservable(); // Return empty observable
    }
    const params = new HttpParams().set('phone', phone);
    return this.http.get<UserSearchResult[]>(`${this.apiUrl}/search-user`, { params })
      .pipe(catchError(this.handleError));
  }

  formatDurationFromMinutes(totalMinutes: number): string {
    if (totalMinutes < 0) return '0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    // Return the error message from the backend, or a generic one
    return throwError(() => new Error(error.error?.message || 'Server error; please try again.'));
  }
 
 
}

//changes