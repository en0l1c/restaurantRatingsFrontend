import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { ApiService } from '../../services/api.service';
import { AverageRatingService } from '../../services/average-rating.service';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReviewService} from '../../services/review.service';
import {Router} from '@angular/router'; // Import the shared service

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css'],
  standalone: false
})
export class RestaurantCardComponent implements OnInit {
  restaurants: any[] = [];
  isLoggedIn: boolean = false;
  isAdmin = true; // Set this based on your actual authentication or user role logic
  user: any;
  averageRatings: { [key: number]: number } = {}; // Store average ratings for each restaurant
  editMode: 'detail' | 'create' | null = null; // Add editMode property

  constructor(
    private apiService: ApiService,
    private restaurantService: RestaurantService,
    private averageRatingService: AverageRatingService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();

    this.apiService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.user = user;
            //console.log('Logged-in User:', this.user); // Debug log
            this.isAdmin = user.role === 0; // Set isAdmin based on role (0 for admin)
          },
          error: (err) => {
            console.error('Error fetching user in navbar:', err); // Debug log
          },
        });
      } else {
        this.user = null; // Reset the user if logged out
        this.isAdmin = false; // Reset admin status if logged out
      }
    });
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.calculateAverageRatings(); // Calculate average ratings after loading restaurants
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      }
    });
  }

  calculateAverageRatings(): void {
    const reviewObservables = this.restaurants.map((restaurant) => {
      return this.reviewService.getReviewsForRestaurant(restaurant.id).pipe(
        map((reviews) => {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

          // Αποθηκεύουμε την μέση βαθμολογία
          this.averageRatings[restaurant.id] = averageRating;

          return {
            id: restaurant.id,
            averageRating: averageRating,
            reviewsCount: reviews.length,
          };
        })
      );
    });

    forkJoin(reviewObservables).subscribe((results) => {
      const allRatings = results.map((result) => result.averageRating);

      // Calculate global average (C)
      const globalAverage =
        allRatings.length > 0
          ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
          : 0;

      const m = 10; // Minimum number of reviews for Bayesian calculation

      // Update restaurant data
      results.forEach((result) => {
        const restaurant = this.restaurants.find((r) => r.id === result.id);
        if (restaurant) {
          const v = result.reviewsCount; // Number of reviews
          const r = result.averageRating; // Average rating
          restaurant.rankScore = (v * r + m * globalAverage) / (v + m); // Bayesian calculation
        }
      });

      // Sort restaurants
      this.restaurants.sort((a, b) => b.rankScore - a.rankScore);
    });
  }


  editRestaurant(restaurant: any): void {
    console.log('Editing restaurant:', restaurant);

    // Choose edit mode based on your preference
    this.editMode = 'create'; // Or 'detail' if you want to edit in the detail view

    if (this.editMode === 'create') {
      // Navigate to the create form with the restaurant ID as a parameter
      this.router.navigate(['/restaurant-create'], { queryParams: { id: restaurant.id } });
    } else if (this.editMode === 'detail') {
      // Navigate to the detail view
      this.router.navigate(['/restaurant', restaurant.id]);
    }
  }
  deleteRestaurant(restaurant: any): void {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      this.restaurantService.deleteRestaurant(restaurant.id).subscribe({
        next: () => {
          console.log('Restaurant deleted');
          this.loadRestaurants();
        },
        error: (error) => {
          console.error('Error deleting restaurant:', error);
        },
      });
    }
  }
}
