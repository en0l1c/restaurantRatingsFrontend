import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Restaurant} from '../models/restaurant.model';
import {Review} from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private baseUrl = 'http://localhost:8080/restaurants';

  constructor(private http: HttpClient) { }

  getAllRestaurants(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

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

  updateRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put<Restaurant>(
      `${this.baseUrl}/${restaurant.id}`,
      restaurant,
      { headers }
    );
  }

  registerRestaurant(restaurant: any) {
    return this.http.post(`${this.baseUrl}/create`, restaurant);
  }

  searchRestaurants(query: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.baseUrl}/search`, {
      params: { q: query },
    });
  }


}
