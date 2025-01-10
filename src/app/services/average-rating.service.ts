// average-rating.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AverageRatingService {
  private averageRatingSource = new BehaviorSubject<number>(0);
  averageRating$ = this.averageRatingSource.asObservable();

  setAverageRating(rating: number): void {
    this.averageRatingSource.next(rating);
  }
}
