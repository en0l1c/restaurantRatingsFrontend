import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';  // Add FormsModule

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  searchQuery: string = ''; // Holds the value of the search input
  user: any; // Store the user details for display

  isAdmin: boolean = false;


  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;  // Update the navbar whenever login state changes
      if (this.isLoggedIn) {
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.user = user;
            console.log('Logged-in User:', this.user); // Debug log
            this.isAdmin = user.role === 0;  // Set isAdmin based on role (0 for admin)
          },
          error: (err) => {
            console.error('Error fetching user in navbar:', err); // Debug log
          },
        });
      } else {
        this.user = null;  // Reset the user if logged out
        this.isAdmin = false;  // Reset admin status if logged out
      }
    });
  }


  logout() {
    localStorage.removeItem('authToken');  // Remove token
    this.apiService.setIsLoggedIn(false);  // Update login state
    this.user = null;  // Clear user state if needed
    this.isAdmin = false;  // Reset admin state
    this.router.navigate(['/login']);  // Redirect to login page
  }

  onSearch(): void {
    if (this.searchQuery) {
      console.log('Search Query:', this.searchQuery);
      // Handle the search logic here
    }
  }
}
