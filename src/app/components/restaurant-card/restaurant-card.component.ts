import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import {Observable, throwError} from 'rxjs';
import {ApiService} from '../../services/api.service';
import { AverageRatingService } from '../../services/average-rating.service'; // Import the shared service



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
  averageRating: number = 0;
  averageRatings: { [key: number]: number } = {};  // Store average ratings for each restaurant


  constructor(
    private apiService: ApiService,
    private restaurantService: RestaurantService,
    private averageRatingService: AverageRatingService
  ) { }


  // ngOnInit(): void {
  //
  //   this.restaurantService.getAllRestaurants().subscribe({
  //     next: (data) => {
  //       this.restaurants = data;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching restaurants:', err);
  //     }
  //   });
  //
  //
  // // show the edit/delete buttons only to admins:
  //   this.apiService.isLoggedIn$.subscribe(status => {
  //     this.isLoggedIn = status;  // Update the navbar whenever login state changes
  //     if (this.isLoggedIn) {
  //       this.apiService.getCurrentUser().subscribe({
  //         next: (user) => {
  //           this.user = user;
  //           console.log('Logged-in User:', this.user); // Debug log
  //           this.isAdmin = user.role === 0;  // Set isAdmin based on role (0 for admin)
  //         },
  //         error: (err) => {
  //           console.error('Error fetching user in navbar:', err); // Debug log
  //         },
  //       });
  //     } else {
  //       this.user = null;  // Reset the user if logged out
  //       this.isAdmin = false;  // Reset admin status if logged out
  //     }
  //   });
  //
  //   // Subscribe to the averageRating$ observable to get the average rating
  //   this.averageRatingService.averageRating$.subscribe((rating) => {
  //     this.averageRating = rating;
  //   });
  // }

  ngOnInit(): void {
    this.loadRestaurants();

    this.apiService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
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

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.calculateAverageRatings();  // Calculate average ratings after loading restaurants
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      }
    });
  }

  calculateAverageRatings(): void {
    this.restaurants.forEach((restaurant) => {
      this.restaurantService.getReviewsForRestaurant(restaurant.id).subscribe((reviews) => {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        this.averageRatings[restaurant.id] = averageRating;
      });
    });
  }



/** to be changed !!!!!! **/
  editRestaurant(restaurant: any): void {
    // Logic to edit the restaurant, perhaps navigating to an edit form
    console.log('Editing restaurant:', restaurant);
    // Example: Navigate to edit page with restaurant ID
    // this.router.navigate(['/edit-restaurant', restaurant.id]);
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
















