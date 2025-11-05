import { Injectable } from '@angular/core';

interface User {
  role: string;
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserRole: string = '';
  private currentUser: User | null = null;

  // Added users 'Jagan' and 'Devraj' to match invoice data for easy testing.
  private users: User[] = [
    {
      "role": "admin",
      "username": "admin@parkease.com",
      "password": "admin@12"

    },
    {
      "role": "user",
      "username": "Jagan@gmail.com",
      "password": "password@12",
      'firstname':"Jagan"
    },
    {
      "role": "user",
      "username": "Devraj@gmail.com",
      "password": "password@12",
      'firstname':'Devraj'
    }
  ];

  constructor() {
    // Load user from storage when the app starts or reloads
    this.loadUserFromSession();
  }

  authenticateUser(username: string, password: string): { isAuthenticated: boolean; role: string } {
    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.currentUserRole = user.role;
      this.currentUser = user;
      
      // Save the logged-in user to sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      return {
        isAuthenticated: true,
        role: user.role
      };
    }
    
    this.currentUserRole = '';
    this.currentUser = null;
    return {
      isAuthenticated: false,
      role: ''
    };
  }

  getCurrentUserRole(): string {
    return this.currentUserRole;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout() {
    this.currentUserRole = '';
    this.currentUser = null;
    // Remove the user from sessionStorage on logout
    sessionStorage.removeItem('currentUser');
  }

  private loadUserFromSession(): void {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.currentUser = user;
      this.currentUserRole = user.role;
    }
  }

  registerUser(userData: { email: string; firstname: string; lastname: string; password: string }): boolean {
    if (this.users.some(user => user.username === userData.email)) {
      return false; // User already exists
    }

    const newUser: User = {
      role: 'user',
      username: userData.email,
      password: userData.password,
      firstname: userData.firstname,
      lastname: userData.lastname
    };

    this.users.push(newUser);
    return true;
  }
}