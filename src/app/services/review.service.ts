
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Review } from '../review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8080/restaurants';

  constructor(private http: HttpClient) {}

  // Fetch reviews for a specific restaurant
  getReviews(restaurantId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/${restaurantId}/reviews`);
  }
  getReviewsForRestaurant(restaurantId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/${restaurantId}/reviews`);
  }
  // Submit a new review
  submitReview(review: Omit<Review, 'userId'>, restaurantId: number): Observable<Review> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.http.post<Review>(`${this.baseUrl}/${restaurantId}/reviews/`, review, { headers });
  }

  // Update a review
  updateReview(updatedReview: Review, restaurantId: number, reviewId: number): Observable<Review> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.http.put<Review>(`${this.baseUrl}/${restaurantId}/reviews/${reviewId}`, updatedReview, { headers });
  }

  // Delete a review
  deleteReview(restaurantId: number, reviewId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.http.delete<void>(`${this.baseUrl}/${restaurantId}/reviews/${reviewId}`, { headers });
  }
}
