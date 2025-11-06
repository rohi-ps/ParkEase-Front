// import { Injectable } from '@angular/core';

// interface User {
//   role: string;
//   username: string;
//   password: string;
//   firstname?: string;
//   lastname?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUserRole: string = '';
//   private currentUser: User | null = null;

//   private users: User[] = [
//     {
//       "role": "admin",
//       "username": "admin1",
//       "password": "adminPass123"
//     },
//     {
//       "role": "user",
//       "username": "user1",
//       "password": "userPass123"
//     },
//     {
//       "role": "user",
//       "username": "user2",
//       "password": "userPass456"
//     }
//   ];

//   authenticateUser(username: string, password: string): { isAuthenticated: boolean; role: string } {
//     const user = this.users.find(u => u.username === username && u.password === password);
    
//     if (user) {
//       this.currentUserRole = user.role;
//       this.currentUser = user;
//       return {
//         isAuthenticated: true,
//         role: user.role
//       };
//     }
    
//     this.currentUserRole = '';
//     this.currentUser = null;
//     return {
//       isAuthenticated: false,
//       role: ''
//     };
//   }

//   getCurrentUserRole(): string {
//     return this.currentUserRole;
//   }

//   getCurrentUser(): User | null {
//     return this.currentUser;
//   }

//   logout() {
//     this.currentUserRole = '';
//     this.currentUser = null;
//   }

//   registerUser(userData: { email: string; firstname: string; lastname: string; password: string }): boolean {
//     // Check if user already exists
//     if (this.users.some(user => user.username === userData.email)) {
//       return false; // User already exists
//     }

//     // Add new user
//     const newUser: User = {
//       role: 'user', // Default role for new registrations
//       username: userData.email,
//       password: userData.password,
//       firstname: userData.firstname,
//       lastname: userData.lastname
//     };

//     this.users.push(newUser);
//     console.log('Updated users array:', this.users);
//     return true;
//   }

//   // Helper method to get all users (for debugging)
//   getAllUsers(): User[] {
//     return this.users;
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthResponse {
  token: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

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
    this.clearToken();
  }

  getCurrentUserRole(): string {
    const decoded = this.decodeToken();
    return decoded?.role || '';
  }

  getCurrentUserEmail(): string {
    const decoded = this.decodeToken();
    return decoded?.email || '';
  }
}