import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Billing {

  constructor(private http: HttpClient) { }

  //specific to admin
  getBillingData(): Observable<any> {
    return this.http.get('http://localhost:3000/api/billing');
  }
  
}
