// average-rating.service.ts
import {Injectable, Input} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Review} from '../review.model';

@Injectable({
  providedIn: 'root',
})
export class AverageRatingService {
  averageRating: number = 0;

  private averageRatingSource = new BehaviorSubject<number>(0);
  averageRating$ = this.averageRatingSource.asObservable();

  setAverageRating(rating: number): void {
    this.averageRatingSource.next(rating);
  }

  // Method to calculate and set the average rating based on the reviews
  calculateAndSetAverageRating(reviews: Review[]): void {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = totalRating / reviews.length;
      this.averageRatingSource.next(average); // Update the average rating
    } else {
      this.averageRatingSource.next(0); // Default to 0 if no reviews
    }
  }



}
