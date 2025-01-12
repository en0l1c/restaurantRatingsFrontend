import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {Restaurant} from '../restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'http://localhost:8080'; // Spring Boot backend URL
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);  // Track login status


  constructor(private http: HttpClient) { }

  // Observable to watch the login state
  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Update the login state
  setIsLoggedIn(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  loginUser(user: any): Observable<{ token: string }> {  // Explicitly typing the response
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, user);  // Return an object with a token property
  }


  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
    if (!token) {
      console.error('No token found in localStorage');
      return throwError('No token found');
    }

    const headers = { 'Authorization': `Bearer ${token}` };  // Send only the token in the header

    return this.http.get(`${this.baseUrl}/auth/users`, { headers });
  }

  // Fetch the current user's details by decoding the token

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError(() => new Error('No token found'));
    }

    const decodedToken: any = jwtDecode(token);
    //console.log('Decoded Token:', decodedToken);  // Debug log

    const currentUsername = decodedToken.sub;  // Assuming 'sub' contains the username

    return new Observable((observer) => {
      this.getAllUsers().subscribe({
        next: (users) => {
          const currentUser = users.find(
            (user: any) => user.username === currentUsername
          );
          console.log('Current User:', currentUser);  // Log the current user object

          if (currentUser) {
            // Ensure the isAdmin flag is set based on role
            observer.next({ ...currentUser, isAdmin: currentUser.role === 0 });
          } else {
            observer.error('Current user not found');
          }
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }




  // You can add more methods for POST, PUT, DELETE as needed
  registerUser(user: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }


  // for users actions
  deleteUser(userId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }

    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete<void>(`${this.baseUrl}/auth/users/${userId}`, { headers });
  }

  updateUser(user: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }

    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.baseUrl}/auth/users/${user.id}`, user, { headers });
  }





}



