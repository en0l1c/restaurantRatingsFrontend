import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {

  returnUrl: string = '/home';

  username: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private apiService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the returnUrl query parameter
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'; // default to home if no return URL is found
  }

  // Do not take token as string, but as token:
  onLogin() {
    const user = { username: this.username, password: this.password };
    this.apiService.loginUser(user).subscribe((response: { token: string }) => {  // Explicitly typing the response
      console.log('Login successful', response);
      const token = response.token;  // Now 'response' is typed correctly with 'token'
      localStorage.setItem('authToken', token);  // Store only the JWT token
      this.apiService.setIsLoggedIn(true);  // Update the logged in status
      //this.router.navigate(['/home']);
      // Handle login logic here, then navigate back to the returnUrl
      this.router.navigate([this.returnUrl]);
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















































