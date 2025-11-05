import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  constructor() { }

  get apiUrl(): string {
    return environment.apiUrl;
  }

  get nodeEnv(): string {
    return environment.nodeEnv || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get jwtSecret(): string {
    return environment.jwtSecret;
  }

  get jwtExpiry(): string {
    return environment.jwtExpiry;
  }

  get defaultCurrency(): string {
    return environment.defaultCurrency;
  }

  get defaultLanguage(): string {
    return environment.defaultLanguage;
  }
}
