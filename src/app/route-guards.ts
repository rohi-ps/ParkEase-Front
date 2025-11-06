import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './Services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

canActivate(): boolean {
  const token = localStorage.getItem('authToken');
  // const isExpired = this.checkTokenExpiry(token);

  if (!token) {
    this.router.navigate(['/login']);
    return false;
  }

  return true;
}

}




