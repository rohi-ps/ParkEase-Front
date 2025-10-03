
import { Login } from './login';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

describe('Login class logic', () => {
  let login: Login;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
 
  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    login = new Login(mockAuthService, mockRouter);
    spyOn(window, 'alert');
    spyOn(console, 'log');
    spyOn(console, 'warn');
  });
 
  it('should initialize with empty email and password', () => {
    expect(login.user.email).toBe('');
    expect(login.user.password).toBe('');
  });
 
  it('should alert "Logged in as Admin" for admin domain', () => {
    login.user.email = 'admin@company.com';
    login.user.password = 'admin123';
 
    const mockForm = { valid: true, value: login.user };
    login.onSubmit(mockForm);
 
    expect(window.alert).toHaveBeenCalledWith('Logged in as Admin');
  });
 
  it('should alert "Logged in as Normal User" for non-admin domain', () => {
    login.user.email = 'user@gmail.com';
    login.user.password = 'user123';
 
    const mockForm = { valid: true, value: login.user };
    login.onSubmit(mockForm);
 
    expect(window.alert).toHaveBeenCalledWith('Logged in as Normal User');
  });
 
  it('should log form data when form is valid', () => {
    login.user.email = 'test@admin.com';
    login.user.password = 'pass';
 
    const mockForm = { valid: true, value: login.user };
    login.onSubmit(mockForm);
 
    expect(console.log).toHaveBeenCalledWith('Login data:', mockForm.value);
  });
 
  it('should warn when form is invalid', () => {
    const mockForm = { valid: false };
 
    login.onSubmit(mockForm);
 
    expect(console.warn).toHaveBeenCalledWith('Form is invalid');
  });
});
 
 
 