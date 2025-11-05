import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    // const authToken = this.authService.getToken();

    // if (authToken) {
    //   // Clone the request and add the authorization header
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${authToken}`
    //     }
    //   });
    // }

    // Handle the request and catch any errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized access
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
