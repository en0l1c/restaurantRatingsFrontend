// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Restaurant } from '../restaurant.model';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class RestaurantService {
//   private apiUrl = 'http://localhost:8080/restaurants';  // Backend URL
//
//   constructor(private http: HttpClient) {}
//
//   // Method to create a new restaurant
//   createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
//     return this.http.post<Restaurant>(this.apiUrl, restaurant);
//   }
//
//   // Method to get all restaurants
//   getRestaurants(): Observable<Restaurant[]> {
//     return this.http.get<Restaurant[]>(this.apiUrl);
//   }
//
//   // Method to get restaurant details by ID
//   getRestaurantById(id: number): Observable<Restaurant> {
//     return this.http.get<Restaurant>(`${this.apiUrl}/${id}`);
//   }
// }




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Restaurant} from '../restaurant.model';

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


}
