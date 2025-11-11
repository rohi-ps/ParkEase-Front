import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
interface AuthResponse {
  token: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'authToken';

  constructor(private http: HttpClient,private router:Router) {}

  authenticateUser(email: string, password: string): Observable<AuthResponse> {
    console.log('Sending login payload:', { email, password });
    return this.http.post<AuthResponse>('http://localhost:3000/api/login', { email, password });
  }

  registerUser(payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
  }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      'http://localhost:3000/api/register',
      payload
    );
  }

  storeToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
  


decodeToken(): any {
  const token = this.getToken();
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const decodedPayload = atob(payload); // base64 decode
    return JSON.parse(decodedPayload);
  } catch (err) {
    console.error('Token decoding failed:', err);
    return null;
  }
}

 logout(): void {
  const token = this.getToken(); // from localStorage or service
  this.http.post<{ message: string }>('http://localhost:3000/api/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: () => this.clearToken(),
    error: err => console.error('Logout failed:', err)
  });
}


  getCurrentUserRole(): string {
    const decoded = this.decodeToken();
    return decoded?.role || '';
  }

  getCurrentUserEmail(): string {
    const decoded = this.decodeToken();
    return decoded?.email || '';
  }

  getCurrentUserId(): string {
    const decoded = this.decodeToken();
    console.log('Decoded token for user ID:', decoded);
    return decoded?.id || '';
  }

}