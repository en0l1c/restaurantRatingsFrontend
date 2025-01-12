import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {Subject} from 'rxjs';
import {RestaurantService} from '../../services/restaurant.service';  // Add FormsModule

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  searchQuery: string = ''; // Holds the value of the search-results input
  user: any; // Store the user details for display

  isAdmin: boolean = false;
  private destroy$ = new Subject<void>();


  constructor(
    private apiService: ApiService,
    private router: Router,
    private restaurantService: RestaurantService,
  ) { }

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
      this.restaurantService
        .searchRestaurants(this.searchQuery)
        .subscribe((restaurants) => {
          // Navigate to the search-results results page with the query
          this.router.navigate(['/search-results'], {
            queryParams: { q: this.searchQuery },
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
