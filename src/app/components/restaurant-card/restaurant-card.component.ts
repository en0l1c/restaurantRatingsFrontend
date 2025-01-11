import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { ApiService } from '../../services/api.service';
import { AverageRatingService } from '../../services/average-rating.service';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators'; // Import the shared service

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

  constructor(
    private apiService: ApiService,
    private restaurantService: RestaurantService,
    private averageRatingService: AverageRatingService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();

    this.apiService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.user = user;
            console.log('Logged-in User:', this.user); // Debug log
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

  // calculateAverageRatings(): void {
  //   const allRatings: number[] = []; // To calculate the global average
  //
  //   // Collect reviews for each restaurant
  //   this.restaurants.forEach((restaurant) => {
  //     this.restaurantService.getReviewsForRestaurant(restaurant.id).subscribe((reviews) => {
  //       const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  //       const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  //
  //       this.averageRatings[restaurant.id] = averageRating; // Store the average rating
  //       allRatings.push(...reviews.map((review) => review.rating)); // Collect all ratings
  //     });
  //   });
  //
  //   // Calculate the global average (C)
  //   const globalAverage = allRatings.length > 0
  //     ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
  //     : 0;
  //
  //   const m = 10; // Minimum number of reviews for Bayesian rating
  //
  //   // Calculate the final score (R) for each restaurant
  //   this.restaurants.forEach((restaurant) => {
  //     const v = restaurant.reviewsCount || 0; // Number of reviews
  //     const r = this.averageRatings[restaurant.id] || 0; // Average rating
  //     const bayesianRating = (v * r + m * globalAverage) / (v + m);
  //
  //     restaurant.rankScore = bayesianRating; // Save the score for sorting
  //   });
  //
  //   // Sort restaurants by rank score
  //   this.restaurants.sort((a, b) => b.rankScore - a.rankScore);
  // }

  calculateAverageRatings(): void {
    const reviewObservables = this.restaurants.map((restaurant) => {
      return this.restaurantService.getReviewsForRestaurant(restaurant.id).pipe(
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

      // Υπολογισμός παγκόσμιου μέσου όρου (C)
      const globalAverage =
        allRatings.length > 0
          ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
          : 0;

      const m = 10; // Ελάχιστος αριθμός αξιολογήσεων για τον Bayesian υπολογισμό

      // Ενημέρωση δεδομένων εστιατορίων
      results.forEach((result) => {
        const restaurant = this.restaurants.find((r) => r.id === result.id);
        if (restaurant) {
          const v = result.reviewsCount; // Αριθμός αξιολογήσεων
          const r = result.averageRating; // Μέση βαθμολογία
          restaurant.rankScore = (v * r + m * globalAverage) / (v + m); // Υπολογισμός Bayesian
        }
      });

      // Ταξινόμηση των εστιατορίων
      this.restaurants.sort((a, b) => b.rankScore - a.rankScore);
    });
  }


  editRestaurant(restaurant: any): void {
    console.log('Editing restaurant:', restaurant);
    // Logic to edit the restaurant, perhaps navigating to an edit form
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































// import { Component, OnInit } from '@angular/core';
// import { RestaurantService } from '../../services/restaurant.service';
// import {Observable, throwError} from 'rxjs';
// import {ApiService} from '../../services/api.service';
// import { AverageRatingService } from '../../services/average-rating.service'; // Import the shared service
//
//
//
// @Component({
//   selector: 'app-restaurant-card',
//   templateUrl: './restaurant-card.component.html',
//   styleUrls: ['./restaurant-card.component.css'],
//   standalone: false
// })
// export class RestaurantCardComponent implements OnInit {
//   restaurants: any[] = [];
//   isLoggedIn: boolean = false;
//
//   isAdmin = true; // Set this based on your actual authentication or user role logic
//   user: any;
//   averageRating: number = 0;
//   averageRatings: { [key: number]: number } = {};  // Store average ratings for each restaurant
//
//
//   constructor(
//     private apiService: ApiService,
//     private restaurantService: RestaurantService,
//     private averageRatingService: AverageRatingService
//   ) { }
//
//
//   // ngOnInit(): void {
//   //
//   //   this.restaurantService.getAllRestaurants().subscribe({
//   //     next: (data) => {
//   //       this.restaurants = data;
//   //     },
//   //     error: (err) => {
//   //       console.error('Error fetching restaurants:', err);
//   //     }
//   //   });
//   //
//   //
//   // // show the edit/delete buttons only to admins:
//   //   this.apiService.isLoggedIn$.subscribe(status => {
//   //     this.isLoggedIn = status;  // Update the navbar whenever login state changes
//   //     if (this.isLoggedIn) {
//   //       this.apiService.getCurrentUser().subscribe({
//   //         next: (user) => {
//   //           this.user = user;
//   //           console.log('Logged-in User:', this.user); // Debug log
//   //           this.isAdmin = user.role === 0;  // Set isAdmin based on role (0 for admin)
//   //         },
//   //         error: (err) => {
//   //           console.error('Error fetching user in navbar:', err); // Debug log
//   //         },
//   //       });
//   //     } else {
//   //       this.user = null;  // Reset the user if logged out
//   //       this.isAdmin = false;  // Reset admin status if logged out
//   //     }
//   //   });
//   //
//   //   // Subscribe to the averageRating$ observable to get the average rating
//   //   this.averageRatingService.averageRating$.subscribe((rating) => {
//   //     this.averageRating = rating;
//   //   });
//   // }
//
//   ngOnInit(): void {
//     this.loadRestaurants();
//
//     this.apiService.isLoggedIn$.subscribe(status => {
//       this.isLoggedIn = status;
//       if (this.isLoggedIn) {
//         this.apiService.getCurrentUser().subscribe({
//           next: (user) => {
//             this.user = user;
//             console.log('Logged-in User:', this.user); // Debug log
//             this.isAdmin = user.role === 0;  // Set isAdmin based on role (0 for admin)
//           },
//           error: (err) => {
//             console.error('Error fetching user in navbar:', err); // Debug log
//           },
//         });
//       } else {
//         this.user = null;  // Reset the user if logged out
//         this.isAdmin = false;  // Reset admin status if logged out
//       }
//     });
//   }
//
//   loadRestaurants(): void {
//     this.restaurantService.getAllRestaurants().subscribe({
//       next: (data) => {
//         this.restaurants = data;
//         this.calculateAverageRatings();  // Calculate average ratings after loading restaurants
//       },
//       error: (err) => {
//         console.error('Error fetching restaurants:', err);
//       }
//     });
//   }
//
//   calculateAverageRatings(): void {
//     this.restaurants.forEach((restaurant) => {
//       this.restaurantService.getReviewsForRestaurant(restaurant.id).subscribe((reviews) => {
//         const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//         const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
//         this.averageRatings[restaurant.id] = averageRating;
//       });
//     });
//   }
//
//
//
// /** to be changed !!!!!! **/
//   editRestaurant(restaurant: any): void {
//     // Logic to edit the restaurant, perhaps navigating to an edit form
//     console.log('Editing restaurant:', restaurant);
//     // Example: Navigate to edit page with restaurant ID
//     // this.router.navigate(['/edit-restaurant', restaurant.id]);
//   }
//
//   deleteRestaurant(restaurant: any): void {
//     const confirmation = confirm('Are you sure you want to delete this user?');
//     if (confirmation) {
//       this.restaurantService.deleteRestaurant(restaurant.id).subscribe({
//         next: () => {
//           console.log('Restaurant deleted');
//           this.loadRestaurants();
//         },
//         error: (error) => {
//           console.error('Error deleting restaurant:', error);
//         },
//       });
//     }
//   }
//
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
