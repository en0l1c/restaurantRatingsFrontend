import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { ApiService } from '../../services/api.service';
import { Restaurant } from '../../restaurant.model';
import { Review } from '../../review.model';
import {AverageRatingService} from '../../services/average-rating.service';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  standalone: false
})
export class RestaurantDetailComponent implements OnInit {
  currentUrl: string | undefined;
  restaurant: Restaurant | undefined;
  reviews: Review[] = [];
  rating: number = 0;
  comment: string = '';
  isLoggedIn: boolean = false;
  userId: number = -1;
  averageRating: number = 0; // Added property to store average rating
  hasReviewed: boolean = false; // Check if user has reviewed

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private router: Router,
    private apiService: ApiService,
    private averageRatingService: AverageRatingService // Inject the shared service
  ) {}


  ngOnInit(): void {
    this.currentUrl = this.router.url;
    const id = +this.route.snapshot.paramMap.get('id')!;

    // Φόρτωση του εστιατορίου
    this.restaurantService.getRestaurantById(id).subscribe((data) => {
      this.restaurant = data;
    });

    // Παρακολούθηση του αν ο χρήστης είναι συνδεδεμένος
    this.apiService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      if (this.isLoggedIn) {
        // Αν είναι συνδεδεμένος, φορτώστε το userId
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.userId = user.id;

            // Φόρτωση των reviews
            this.restaurantService.getReviewsForRestaurant(id).subscribe((reviews) => {
              this.reviews = reviews;
              this.calculateAverageRating();

              // Υπολογισμός του hasReviewed
              this.updateHasReviewed();
            });
          },
          error: (err) => {
            console.error('Error fetching user details:', err);
          },
        });
      } else {
        // Αν δεν είναι συνδεδεμένος, φορτώστε μόνο τα reviews
        this.restaurantService.getReviewsForRestaurant(id).subscribe((reviews) => {
          this.reviews = reviews;
          this.calculateAverageRating();
        });
      }
    });
  }

// Μέθοδος για υπολογισμό του hasReviewed
  updateHasReviewed(): void {
    this.hasReviewed = this.reviews.some((review) => review.userId === this.userId);
  }




  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / this.reviews.length;
    } else {
      this.averageRating = 0;  // Default to 0 if there are no reviews
    }

    // pass the avgRating to averageRating service
    this.averageRatingService.setAverageRating(this.averageRating);
  }




  submitReview(): void {
    if (!this.isLoggedIn) {
      alert('Please log in to submit a review.');
      return;
    }

    const newReview: Omit<Review, 'userId'> = {
      restaurantId: this.restaurant!.id!,
      rating: this.rating,
      comment: this.comment,
    };

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found!');
      return;
    }

    this.restaurantService.submitReview(newReview, this.restaurant!.id).subscribe({
      next: (response) => {
        this.reviews.push(response);
        this.calculateAverageRating();  // Recalculate average after submitting review
        this.rating = 0;
        this.comment = '';
      },
      error: (err) => {
        console.error('Failed to submit review:', err);
        if (err.status === 401) {
          alert('Session expired. Please log in again.');
        }
        else if (err.status === 409) {
                  alert('You have already submitted a review for this restaurant.');

        }
        else {
          alert('Unable to submit review. Please try again.');
        }
      },
    });
  }

  editReview(review: Review): void {
    if (this.isLoggedIn && review.userId === this.userId) {
      this.rating = review.rating;
      this.comment = review.comment;

      // Ensure restaurantId and review.id are defined before calling the service
      if (review.restaurantId && review.id) {
        const updatedReview: Review = {
          restaurantId: review.restaurantId,
          rating: this.rating,
          comment: this.comment,
          userId: this.userId,  // You might need to pass userId as well, depending on your backend requirements
        };

        // Call the updateReview method
        this.restaurantService.updateReview(updatedReview, review.restaurantId, review.id)
          .subscribe({
            next: (response) => {
              console.log('Review updated:', response);
            },
            error: (err) => {
              console.error('Error updating review:', err);
              alert('Failed to update the review.');
            }
          });
      } else {
        console.error('Restaurant ID or Review ID is missing.');
        alert('Invalid review or restaurant data.');
      }
    } else {
      alert('You can only edit your own review.');
    }
  }



  deleteReview(review: Review): void {
    if (this.isLoggedIn && review.userId === this.userId) {
      if (review.id !== undefined) {
        this.restaurantService.deleteReview(review.id).subscribe({
          next: () => {
            this.reviews = this.reviews.filter((r) => r.id !== review.id);  // Remove review from the list
          },
          error: (err) => {
            console.error('Error deleting review:', err);
          }
        });
      } else {
        console.error('Review ID is undefined, unable to delete.');
      }
    } else {
      alert('You can only delete your own review.');
    }
  }

  onStarClick(value: number): void {
    this.rating = value; // Update the rating when a star is clicked
  }
}






























// ngOnInit(): void {
//   this.currentUrl = this.router.url;
//   const id = +this.route.snapshot.paramMap.get('id')!;
//
//   this.restaurantService.getRestaurantById(id).subscribe((data) => {
//     this.restaurant = data;
//   });
//
//   this.restaurantService.getReviewsForRestaurant(id).subscribe((reviews) => {
//     this.reviews = reviews;
//     this.calculateAverageRating();  // Calculate average rating when reviews are fetched
//   });
//
//   this.apiService.isLoggedIn$.subscribe((status) => {
//     this.isLoggedIn = status;
//     if (this.isLoggedIn) {
//       this.apiService.getCurrentUser().subscribe({
//         next: (user) => {
//           this.userId = user.id;
//         },
//         error: (err) => {
//           console.error('Error fetching user details:', err);
//         },
//       });
//     }
//   });
// }





















// submitReview(): void {
//   if (!this.isLoggedIn) {
//     alert('Please log in to submit a review.');
//     return;
//   }
//
//   const newReview: Omit<Review, 'userId'> = {
//     restaurantId: this.restaurant!.id!,
//     rating: this.rating,
//     comment: this.comment,
//   };
//
//   const token = localStorage.getItem('authToken');
//   if (!token) {
//     console.error('No auth token found!');
//     return;
//   }
//
//   this.restaurantService.submitReview(newReview, this.restaurant!.id).subscribe({
//     next: (response) => {
//       this.reviews.push(response);
//       this.calculateAverageRating();
//       this.updateHasReviewed();
//       this.rating = 0;
//       this.comment = '';
//     },
//     error: (err) => {
//       console.error('Failed to submit review:', err);
//       if (err.status === 401) {
//         alert('Session expired. Please log in again.');
//       } else if (err.status === 409) {
//         alert('You have already submitted a review for this restaurant.');
//       } else {
//         alert('Unable to submit review. Please try again.');
//       }
//     },
//   });
// }
