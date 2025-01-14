import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, switchMap } from 'rxjs';
import { Review } from '../models/review.model';
import { ReviewService } from './review.service';
import { Restaurant } from '../models/restaurant.model';
import { RestaurantService } from './restaurant.service';

@Injectable({
  providedIn: 'root',
})
export class AverageRatingService {
  private averageRatingsSubject = new BehaviorSubject<{ [key: number]: number }>(
    {}
  );
  averageRatings$ = this.averageRatingsSubject.asObservable();

  constructor(
    private reviewService: ReviewService,
    private restaurantService: RestaurantService
  ) {}

  calculateAndSetAverageRatings(
    restaurants: Restaurant[]
  ): Observable<Restaurant[]> {
    return forkJoin(
      restaurants.map((restaurant) =>
        this.reviewService.getReviewsForRestaurant(restaurant.id!).pipe(
          map((reviews) => {
            const totalRating = reviews.reduce(
              (sum, review) => sum + review.rating,
              0
            );
            const averageRating =
              reviews.length > 0 ? totalRating / reviews.length : 0;

            // Update the restaurant object with reviews and average rating
            restaurant.reviews = reviews;
            restaurant.averageRating = averageRating;

            return {
              restaurant,
              averageRating,
              reviewsCount: reviews.length,
            };
          })
        )
      )
    ).pipe(
      map((results) => {
        const m = 10; // Minimum number of reviews for Bayesian calculation

        results.forEach((result) => {
          const restaurant = result.restaurant;
          const v = result.reviewsCount;
          const r = result.averageRating;
          const allRatings = results.map((res) => res.averageRating);
          const globalAverage =
            allRatings.length > 0
              ? allRatings.reduce((sum, rating) => sum + rating, 0) /
              allRatings.length
              : 0;

          restaurant.rankScore = (v * r + m * globalAverage) / (v + m);
        });

        // Sort restaurants by rankScore
        restaurants.sort((a, b) => b.rankScore! - a.rankScore!);

        // Update average ratings
        const averageRatings: { [key: number]: number } = {};
        restaurants.forEach(restaurant => {
          averageRatings[restaurant.id!] = restaurant.averageRating;
        });
        this.averageRatingsSubject.next(averageRatings);

        return restaurants;
      })
    );
  }
}
