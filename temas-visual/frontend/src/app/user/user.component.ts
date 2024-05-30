import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any = {};
  errorMessages: { name?: string; email?: string; password?: string } = {};
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: response => {
        this.user = response;
      },
      error: err => {
        console.error('Error fetching user data', err);
        this.router.navigate(['login']);
      }
    });
  }

  updateUser() {
    this.errorMessages = {};
    this.successMessage = '';
    this.authService.updateUser(this.user).subscribe({
      next: response => {
        this.user = response;
        this.successMessage = 'User data updated successfully';
        this.router.navigate(['landing']);
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

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  goBack() {
    this.router.navigate(['landing']);
  }
}
