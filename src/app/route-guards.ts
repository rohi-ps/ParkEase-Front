import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './Services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

 canActivate():boolean{
  const token = localStorage.getItem('authToken');
  // const isExpired = this.authService.isTokenExpired(token);

  if (this.authService.getCurrentUserRole()=== null) {
    return true;
  }
  else if(!token){
    this.router.navigate(['/login']);
    return false;
  }
  else {
    return true;
  }
}
}




