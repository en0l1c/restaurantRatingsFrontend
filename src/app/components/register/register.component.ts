import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';  // Import Router for redirection
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const newUser = {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };

    this.apiService.registerUser(newUser).subscribe({
      next: (response) => {
        // Log and handle success response
        console.log('Registration successful', response);
        this.successMessage = 'Registration successful! You can now log in.';

        // Redirect to login page after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        // Log error response and handle error
        console.error('Registration failed', error);
        if (error.error) {
          console.error('Error message from backend:', error.error);  // Log the actual error message
        }
        this.errorMessage = 'Registration failed. Please try again later.';
      }
    });
  }
}
