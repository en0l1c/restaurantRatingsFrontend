import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  throwError,
  tap,
  shareReplay,
  Subject,
  takeUntil,
  combineLatest,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Restaurant } from '../models/restaurant.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'http://localhost:8080';

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('authToken')
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();


  // Update the login state
  setIsLoggedIn(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  constructor(private http: HttpClient) {
    this.isLoggedIn$
      .pipe(
        tap((status) => {
          if (status) {
            this.getCurrentUser()
              .pipe(
                tap((user) => {
                  this.userSubject.next(user);
                  this.isAdminSubject.next(user.role === 0);
                })
              )
              .subscribe({
                error: (err) => {
                  console.error('Error fetching user:', err);
                },
              });
          } else {
            this.userSubject.next(null);
            this.isAdminSubject.next(false);
          }
        })
      )
      .subscribe();
  }

  loginUser(user: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, user).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
        this.isLoggedInSubject.next(true);
      })
    );
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

    const currentUsername = decodedToken.sub;

    return new Observable((observer) => {
      this.getAllUsers().subscribe({
        next: (users) => {
          const currentUser = users.find(
            (user: any) => user.username === currentUsername
          );
          console.log('Current User:', currentUser);  // Log the current user object

          if (currentUser) {
            // isAdmin flag is set based on role
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

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
    this.userSubject.next(null);
    this.isAdminSubject.next(false);
  }

}






















