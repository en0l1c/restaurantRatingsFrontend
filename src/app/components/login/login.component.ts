import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  successMessage: string = '';  // Add success message variable
  errorMessage: string = '';    // Add error message variable

  constructor(private apiService: ApiService, private router: Router) { }


  // dont take token as string, but as token:
  onLogin() {
    const user = { username: this.username, password: this.password };
    this.apiService.loginUser(user).subscribe((response: { token: string }) => {  // Explicitly typing the response
      console.log('Login successful', response);
      const token = response.token;  // Now 'response' is typed correctly with 'token'
      localStorage.setItem('authToken', token);  // Store only the JWT token
      this.apiService.setIsLoggedIn(true);  // Update the logged-in status
      this.router.navigate(['/home']);
      this.successMessage = "Login successful!";
      // setTimeout(() => {
      //   this.router.navigate(['/home']);
      // }, 2000);
    }, error => {
      console.error('Login failed', error);
      this.errorMessage = 'Invalid credentials, please try again.';
    });
  }


}















































