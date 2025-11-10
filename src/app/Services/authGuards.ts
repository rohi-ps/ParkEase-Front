// auth-role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if (!token) {
    router.navigate(['']);
    return false;
  }

  return true;
};

export const roleGuard = (expectedRole: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const role = authService.getCurrentUserRole();
    if (role !== expectedRole) {
      router.navigate(['/homepage']);
      return false;
    }

    return true;
  };
};
