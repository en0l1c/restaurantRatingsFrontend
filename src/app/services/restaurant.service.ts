import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Restaurant} from '../restaurant.model';
import {Review} from '../review.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private baseUrl = 'http://localhost:8080/restaurants';

  constructor(private http: HttpClient) { }

  getAllRestaurants(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

    // Method to get restaurant details by ID
  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.baseUrl}/${id}`);
  }

  // deleteRestaurant(id: number): Observable<Restaurant> {
  //   return this.http.delete<Restaurant>(`${this.baseUrl}/restaurants/delete`);
  // }

  deleteRestaurant(restaurantId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete<void>(`${this.baseUrl}/${restaurantId}`, { headers });
  }

  // reviews:
  // Fetch reviews for a specific restaurant
  getReviewsForRestaurant(restaurantId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/${restaurantId}/reviews`);
  }

  // Submit a new review
  submitReview(review: Review, restaurantId: number): Observable<Review> {
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



  // Delete a review
  deleteReview(reviewId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete<void>(`${this.baseUrl}/reviews/${reviewId}`, { headers });
  }




}
