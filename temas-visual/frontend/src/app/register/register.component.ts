import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessages: { name?: string; email?: string; password?: string } = {};

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessages = {}; // Clear previous errors
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: response => {
        console.log('User registered', response);
        this.router.navigate(['login']);
      },
      error: err => {
        if (err.status === 422) {
          const errors = err.error.errors;
          if (errors.name) {
            this.errorMessages.name = errors.name[0];
          }
          if (errors.email) {
            this.errorMessages.email = errors.email[0];
          }
          if (errors.password) {
            this.errorMessages.password = errors.password[0];
          }
        } else {
          console.error('Unexpected error', err);
        }
      }
    });
  }
}
