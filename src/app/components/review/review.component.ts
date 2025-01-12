import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../review.model';
import { AverageRatingService } from '../../services/average-rating.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { OnChanges } from '@angular/core';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  standalone: false,
})
export class ReviewComponent implements OnInit, OnChanges {
  @Input() restaurantId!: number;
  @Input() reviews!: Review[];
  @Input() isLoggedIn: boolean = false;
  @Input() userId: number = -1;
  @Output() reviewAdded = new EventEmitter<Review>();
  @Output() reviewUpdated = new EventEmitter<Review>();
  @Output() reviewDeleted = new EventEmitter<number>();

  userReview: Review | undefined; // review from logged in user
  otherReviews: Review[] = [];

  rating: number = 0;
  comment: string = '';
  averageRating: number = 0;
  @Input() hasReviewed!: boolean;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private averageRatingService: AverageRatingService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reviews'] && this.reviews) {
      this.separateReviews();
    }
  }
  // seperate the reviews to show first the review of loggedin user
  separateReviews(): void {
    this.userReview = this.reviews.find(review => this.isLoggedIn && review.user?.id === this.userId);
    this.otherReviews = this.reviews.filter(review => !this.isLoggedIn || review.user?.id !== this.userId);
  }

  submitReview(): void {
    if (!this.isLoggedIn) {
      alert('Please log in to submit a review.');
      return;
    }

    const newReview: Omit<Review, 'userId'> = {
      restaurantId: this.restaurantId!,
      rating: this.rating,
      comment: this.comment,
    };

    this.reviewService.submitReview(newReview, this.restaurantId!).subscribe({
      next: (response) => {
        this.reviewAdded.emit(response);
        this.averageRatingService.calculateAndSetAverageRating(this.reviews);
        this.rating = 0;
        this.comment = '';
      },
      error: (err) => {
        console.error('Failed to submit review:', err);
        if (err.status === 401) {
          alert('Session expired. Please log in again.');
        } else if (err.status === 409) {
          alert('You have already submitted a review for this restaurant.');
        } else {
          alert('Unable to submit review. Please try again.');
        }
      },
    });
  }

  editReview(review: Review): void {
    if (!this.isLoggedIn || !review.user || review.user.id !== this.userId) {
      alert('You can only edit your own review.');
      return;
    }

    // Ensure restaurantId and id are valid numbers
    if (review.restaurantId === undefined || review.id === undefined) {
      console.error('Restaurant ID or Review ID is missing.'); // This is line 79
      alert('Invalid review or restaurant data.');
    }
    if (this.isLoggedIn && review.user.id === this.userId) {
      if (review.restaurantId === undefined || review.id === undefined) {
        console.error('Restaurant ID or Review ID is missing.');
        alert('Invalid review or restaurant data.');
        return;
      }

      this.rating = review.rating;
      this.comment = review.comment;

      const updatedReview: Review = {
        id: review.id,
        restaurantId: review.restaurantId,
        rating: this.rating,
        comment: this.comment,
        user: review.user
      };

      this.reviewService.updateReview(updatedReview, review.restaurantId, review.id).subscribe({
        next: (response) => {
          this.reviewUpdated.emit(response);
        },
        error: (err) => {
          console.error('Error updating review:', err);
          alert('Failed to update the review.');
        },
      });
    } else {
      alert('You can only edit your own review.');
    }
  }

  deleteReview(review: Review): void {
    if (!this.isLoggedIn || !review.user || review.user.id !== this.userId) {
      alert('You can only delete your own review.');
      return;
    }
    if (this.isLoggedIn && review.user.id === this.userId) {
      if (review.id !== undefined) {
        this.reviewService.deleteReview(this.restaurantId,review.id).subscribe({
          next: () => {
            this.reviewDeleted.emit(review.id);
          },
          error: (err) => {
            console.error('Error deleting review:', err);
          },
        });
      } else {
        console.error('Review ID is undefined, unable to delete.');
      }
    } else {
      alert('You can only delete your own review.');
    }
  }

  onStarClick(value: number): void {
    this.rating = value;
  }
}















// import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
// import { ReviewService } from '../../services/review.service';
// import { Review } from '../../review.model';
// import { AverageRatingService } from '../../services/average-rating.service';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { ApiService } from '../../services/api.service';
// import { OnChanges } from '@angular/core';
// import { debounceTime } from 'rxjs';
//
// @Component({
//   selector: 'app-review',
//   templateUrl: './review.component.html',
//   styleUrls: ['./review.component.css'],
//   standalone: false,
// })
// export class ReviewComponent implements OnInit {
//   @Input() restaurantId!: number;
//   @Input() reviews!: Review[];
//   @Input() isLoggedIn: boolean = false;
//   @Input() userId: number = -1;
//   @Input() hasReviewed: boolean = false; // Now using Input for hasReviewed
//   @Output() reviewAdded = new EventEmitter<Review>();
//   @Output() reviewUpdated = new EventEmitter<Review>();
//   @Output() reviewDeleted = new EventEmitter<number>();
//
//   rating: number = 0;
//   comment: string = '';
//   averageRating: number = 0;
//
//   constructor(
//     private reviewService: ReviewService,
//     private route: ActivatedRoute,
//     private averageRatingService: AverageRatingService,
//     private apiService: ApiService
//   ) {}
//
//   ngOnInit() {
//   }
//
//   ngOnChanges(changes: SimpleChanges) {
//     // React to changes in the input properties
//     if (changes['reviews'] || changes['userId']) {
//     }
//   }
//
//   submitReview(): void {
//     if (!this.isLoggedIn) {
//       alert('Please log in to submit a review.');
//       return;
//     }
//
//     if (this.hasReviewed) {
//       alert('You have already reviewed this restaurant.');
//       return;
//     }
//
//     const newReview: Omit<Review, 'userId'> = {
//       restaurantId: this.restaurantId!,
//       rating: this.rating,
//       comment: this.comment,
//     };
//
//     this.reviewService.submitReview(newReview, this.restaurantId!).subscribe({
//       next: (response) => {
//         this.reviewAdded.emit(response);
//         this.averageRatingService.calculateAndSetAverageRating(this.reviews);
//         this.rating = 0;
//         this.comment = '';
//       },
//       error: (err) => {
//         console.error('Failed to submit review:', err);
//         if (err.status === 401) {
//           alert('Session expired. Please log in again.');
//         } else if (err.status === 409) {
//           alert('You have already submitted a review for this restaurant.');
//         } else {
//           alert('Unable to submit review. Please try again.');
//         }
//       },
//     });
//   }
//
//   editReview(review: Review): void {
//     if (this.isLoggedIn && review.userId === this.userId) {
//       if (review.restaurantId === undefined || review.id === undefined) {
//         console.error('Restaurant ID or Review ID is missing.');
//         alert('Invalid review or restaurant data.');
//         return;
//       }
//
//       this.rating = review.rating;
//       this.comment = review.comment;
//
//       const updatedReview: Review = {
//         restaurantId: review.restaurantId,
//         rating: this.rating,
//         comment: this.comment,
//         userId: this.userId,
//       };
//
//       this.reviewService.updateReview(updatedReview, review.restaurantId, review.id).subscribe({
//         next: (response) => {
//           this.reviewUpdated.emit(response);
//         },
//         error: (err) => {
//           console.error('Error updating review:', err);
//           alert('Failed to update the review.');
//         },
//       });
//     } else {
//       alert('You can only edit your own review.');
//     }
//   }
//
//   deleteReview(review: Review): void {
//     if (this.isLoggedIn && review.userId === this.userId) {
//       if (review.id !== undefined) {
//         this.reviewService.deleteReview(review.id).subscribe({
//           next: () => {
//             this.reviewDeleted.emit(review.id);
//           },
//           error: (err) => {
//             console.error('Error deleting review:', err);
//           },
//         });
//       } else {
//         console.error('Review ID is undefined, unable to delete.');
//       }
//     } else {
//       alert('You can only delete your own review.');
//     }
//   }
//
//   onStarClick(value: number): void {
//     this.rating = value;
//   }
// }

















// import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
// import { ReviewService } from '../../services/review.service';  // Import the ReviewService
// import { Review } from '../../review.model';
// import { AverageRatingService } from '../../services/average-rating.service';
// import { FormsModule } from '@angular/forms';
// import {ActivatedRoute} from '@angular/router';
// import {ApiService} from '../../services/api.service';
// import {OnChanges} from '@angular/core';
// import {debounceTime} from 'rxjs';
//
// @Component({
//   selector: 'app-review',
//   templateUrl: './review.component.html',
//   styleUrls: ['./review.component.css'],
//   standalone: false
// })
// export class ReviewComponent implements OnInit {
//   @Input() restaurantId!: number;
//   //@Output() reviews: Review[] = [];
//   @Input() reviews!: Review[];
//
//   @Input() isLoggedIn: boolean = false;
//   @Input() userId: number = -1;
//   @Input() hasReviewed: boolean = false;
//
//   rating: number = 0;
//   comment: string = '';
//   averageRating: number = 0;
//
//
//
//   @Output() reviewAdded = new EventEmitter<Review>();
//   @Output() reviewUpdated = new EventEmitter<Review>();
//   @Output() reviewDeleted = new EventEmitter<number>();
//
//   constructor(
//     private reviewService: ReviewService, // Inject ReviewService here
//     private route: ActivatedRoute,
//     private averageRatingService: AverageRatingService,
//     private apiService: ApiService,
//   ) {}
//
//
//   ngOnInit() {
//     console.log('Has Reviewed from Parent:', this.hasReviewed);
//     this.updateHasReviewed();
//   }
//
//   updateHasReviewed(): void {
//     if (this.reviews && this.userId !== -1) {
//       // Check if any review matches the userId
//       this.hasReviewed = this.reviews.some(review => review.userId === this.userId);
//       console.log("userId: " + this.userId);
//       console.log("hasReviewed: " + this.hasReviewed);
//     }
//   }
//
//
//
//
//   submitReview(): void {
//     if (!this.isLoggedIn) {
//       alert('Please log in to submit a review.');
//       return;
//     }
//
//     if (this.hasReviewed) {
//       alert('You have already reviewed this restaurant.');
//       return;
//     }
//
//     const newReview: Omit<Review, 'userId'> = {
//       restaurantId: this.restaurantId!,
//       rating: this.rating,
//       comment: this.comment,
//     };
//
//     this.reviewService.submitReview(newReview, this.restaurantId!).subscribe({
//       next: (response) => {
//         this.reviews.push(response);
//         this.reviewAdded.emit(response);
//         this.averageRatingService.calculateAndSetAverageRating(this.reviews); //update instantly avg rating when user submit new rating
//         this.rating = 0;
//         this.comment = '';
//       },
//       error: (err) => {
//         console.error('Failed to submit review:', err);
//         if (err.status === 401) {
//           alert('Session expired. Please log in again.');
//         } else if (err.status === 409) {
//           alert('You have already submitted a review for this restaurant.');
//         } else {
//           alert('Unable to submit review. Please try again.');
//         }
//       },
//     });
//   }
//
//   editReview(review: Review): void {
//     if (this.isLoggedIn && review.userId === this.userId) {
//       // Ensure restaurantId and id are valid numbers
//       if (review.restaurantId === undefined || review.id === undefined) {
//         console.error('Restaurant ID or Review ID is missing.');
//         alert('Invalid review or restaurant data.');
//         return;
//       }
//
//       this.rating = review.rating;
//       this.comment = review.comment;
//
//       const updatedReview: Review = {
//         restaurantId: review.restaurantId,  // Ensures restaurantId is a number
//         rating: this.rating,
//         comment: this.comment,
//         userId: this.userId,
//       };
//
//       this.reviewService.updateReview(updatedReview, review.restaurantId, review.id).subscribe({
//         next: (response) => {
//           this.reviewUpdated.emit(response);
//         },
//         error: (err) => {
//           console.error('Error updating review:', err);
//           alert('Failed to update the review.');
//         }
//       });
//     } else {
//       alert('You can only edit your own review.');
//     }
//
//   }
//
//   deleteReview(review: Review): void {
//     if (this.isLoggedIn && review.userId === this.userId) {
//       if (review.id !== undefined) {
//         this.reviewService.deleteReview(review.id).subscribe({
//           next: () => {
//             this.reviews = this.reviews.filter((r) => r.id !== review.id);
//             this.reviewDeleted.emit(review.id);
//           },
//           error: (err) => {
//             console.error('Error deleting review:', err);
//           }
//         });
//       } else {
//         console.error('Review ID is undefined, unable to delete.');
//       }
//     } else {
//       alert('You can only delete your own review.');
//     }
//   }
//
//   onStarClick(value: number): void {
//     this.rating = value;
//   }
//
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
//
//
