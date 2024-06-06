import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessages: { email?: string; password?: string; general?: string } = {};

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessages = {}; // Clear previous errors
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: response => {
        console.log('User logged in', response);
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['landing']);
      },
      error: err => {
        if (err.status === 422) {
          const errors = err.error.errors;
          if (errors.email) {
            this.errorMessages.email = errors.email[0];
          }
          if (errors.password) {
            this.errorMessages.password = errors.password[0];
          }
        } else if (err.status === 401) {
          this.errorMessages.general = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessages.general = 'An unexpected error occurred. Please try again later.';
          console.error('Unexpected error', err);
        }
      }
    });
  }
}
