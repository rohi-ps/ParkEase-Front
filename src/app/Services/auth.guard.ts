import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getCurrentUserRole();
    const allowedRoles = route.data['roles'] as Array<string>;

    if (!userRole) {
      this.router.navigate(['/']);
      return false;
    }

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // If role doesn't match, redirect to appropriate dashboard
    if (userRole === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
    return false;
  }
}
