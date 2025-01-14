import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Subject, takeUntil } from 'rxjs';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false,
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  searchQuery: string = ''; // Holds the value of the search-results input
  user: any; // Store the user details for display

  isAdmin: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: AuthService,
    private router: Router,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    this.apiService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isLoggedIn = status;
      });

    this.apiService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
        console.log('Logged-in User:', this.user);
      });

    this.apiService.isAdmin$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        console.log('Logged-in User is admin:', this.isAdmin);
      });
  }

  logout() {
    this.apiService.logout(); // Call logout() from AuthService
    this.router.navigate(['/login']);
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
