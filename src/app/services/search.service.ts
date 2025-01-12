import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../restaurant.model'; // Import your Restaurant model

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseUrl = 'http://localhost:8080/restaurants'; // Your backend API base URL

  constructor(private http: HttpClient) {}

  searchRestaurants(query: string): Observable<Restaurant[]> {
    // Use query parameters to send the search-results term to the backend
    return this.http.get<Restaurant[]>(`${this.baseUrl}/search`, {
      params: {
        q: query,
      },
    });
  }
}
