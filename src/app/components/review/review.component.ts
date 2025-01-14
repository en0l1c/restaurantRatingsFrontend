import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { AverageRatingService } from '../../services/average-rating.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
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
  @Input() isAdmin: boolean = false;


  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private averageRatingService: AverageRatingService,
    private apiService: AuthService
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

  toggleHidden(review: Review): void {
    if (this.restaurantId === undefined || review.id === undefined) {
      console.error('Restaurant ID or Review ID is undefined.');
      return;
    }
    this.reviewService.toggleReviewHiddenStatus(this.restaurantId, review.id).subscribe({
      next: (updatedReview) => {
        review.hidden = updatedReview.hidden; // Update the hidden status in the UI
      },
      error: (err) => {
        console.error('Error toggling review hidden status:', err);
      },
    });
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
        this.rating = 0;
        this.comment = '';

        // Instead of calling calculateAndSetAverageRatings directly,
        // refresh the reviews for the restaurant
        this.reviewService.getReviewsForRestaurant(this.restaurantId).subscribe(reviews => {
          // this.reviews = reviews;
        });
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

