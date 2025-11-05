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

  private users: User[] = [
    {
      "role": "admin",
      "username": "admin1",
      "password": "adminPass123"
    },
    {
      "role": "user",
      "username": "user1",
      "password": "userPass123"
    },
    {
      "role": "user",
      "username": "user2",
      "password": "userPass456"
    }
  ];

  authenticateUser(username: string, password: string): { isAuthenticated: boolean; role: string } {
    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.currentUserRole = user.role;
      this.currentUser = user;
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
  }

  registerUser(userData: { email: string; firstname: string; lastname: string; password: string }): boolean {
    // Check if user already exists
    if (this.users.some(user => user.username === userData.email)) {
      return false; // User already exists
    }

    // Add new user
    const newUser: User = {
      role: 'user', // Default role for new registrations
      username: userData.email,
      password: userData.password,
      firstname: userData.firstname,
      lastname: userData.lastname
    };

    this.users.push(newUser);
    console.log('Updated users array:', this.users);
    return true;
  }

  // Helper method to get all users (for debugging)
  getAllUsers(): User[] {
    return this.users;
  }
}
