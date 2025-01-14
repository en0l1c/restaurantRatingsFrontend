import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth-service';
import { Restaurant } from '../../models/restaurant.model';
import { Review } from '../../models/review.model';
import { AverageRatingService } from '../../services/average-rating.service';
import { ReviewComponent } from '../../components/review/review.component';
import { ReviewService } from '../../services/review.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  standalone: false,
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {
  currentUrl: string | undefined;
  restaurant!: Restaurant;
  reviews: Review[] = [];
  rating: number = 0;
  comment: string = '';
  isLoggedIn: boolean = false;
  userId: number = -1;
  averageRating: number = 0;
  hasReviewed: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private router: Router,
    private apiService: AuthService,
    private reviewService: ReviewService,
    private averageRatingService: AverageRatingService
  ) {
    this.currentUrl = this.router.url;
  }

  private averageRatingSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    // Capture the current route URL with query parameters
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.createUrlTree([event.url]).toString();
      }
    });

    const id = +this.route.snapshot.paramMap.get('id')!;
    // this.averageRatingSubscription = this.averageRatingService.averageRatings$.subscribe(
    //   (rating) => this.averageRating = rating
    // );
    this.averageRatingSubscription = this.averageRatingService.averageRatings$.subscribe(
      (rating: { [key: number]: number }) => this.averageRating = Object.values(rating)[0]
    );

    this.restaurantService.getRestaurantById(id).subscribe((data) => {
      this.restaurant = data;
      this.loadReviews(id); // Load reviews after getting the restaurant
    });

    this.apiService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.userId = user.id;
            this.isAdmin = user.role === 0; // Check if the user is an admin

            console.log("User ID fetched:", this.userId); // Log the user ID

            // Check if user has reviewed after reviews are loaded AND user is fetched
            if (this.reviews.length > 0) {
              this.checkIfUserHasReviewed();
            }
          },
          error: (err) => console.error('Error fetching user details:', err),
        });
      }
    });
  }

  loadReviews(restaurantId: number): void {
    this.reviewService.getReviewsForRestaurant(restaurantId).subscribe((reviews) => {
      this.reviews = reviews;
      console.log("Reviews fetched:", reviews);

      this.averageRatingService.calculateAndSetAverageRatings([
        {
          ...this.restaurant,
          id: restaurantId,
          averageRating: 0,
          name: this.restaurant.name,
          address: this.restaurant.address,
          phone: this.restaurant.phone,
          description: this.restaurant.description,
          image: this.restaurant.image
        }
      ]).subscribe(() => {
        this.averageRatingService.averageRatings$.subscribe(ratings => {
          this.averageRating = ratings[restaurantId];
        });
      });

      this.reviews = reviews.map((review) => ({
        ...review,
        restaurantId: review.restaurantId || restaurantId,
      }));

      if (this.userId !== -1) {
        this.checkIfUserHasReviewed();
      }
    });
  }

  checkIfUserHasReviewed(): void {
    console.log("Checking if user has reviewed...");
    if (this.isLoggedIn && this.userId !== -1 && this.reviews) {
      const userIdString = String(this.userId);
      this.hasReviewed = this.reviews.some((review) => {
        // Access nested user object
        if (review.user === undefined || review.user.id === undefined) {
          return false;
        }
        return String(review.user.id) === userIdString;
      });
      console.log("restaurant-detail - userId:", this.userId);
      console.log("restaurant-detail - hasReviewed:", this.hasReviewed);
    }
  }

  // handleReviewAdded(newReview: Review): void {
  //   this.reviews.push(newReview);
  //   this.checkIfUserHasReviewed();
  // }
  //
  // handleReviewUpdated(updatedReview: Review): void {
  //   const index = this.reviews.findIndex((review) => review.id === updatedReview.id);
  //   if (index !== -1) {
  //     this.reviews[index] = updatedReview;
  //     this.checkIfUserHasReviewed();
  //   }
  // }
  //
  // handleReviewDeleted(deletedReviewId: number): void {
  //   this.reviews = this.reviews.filter((review) => review.id !== deletedReviewId);
  //   this.checkIfUserHasReviewed();
  // }

  ngOnDestroy(): void {
    this.averageRatingSubscription.unsubscribe();
  }
}




