import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

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
    console.log('Decoded Token:', decodedToken);  // Debug log

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

  registerRestaurant(restaurant: any) {
    return this.http.post(`${this.baseUrl}/restaurants/create`, restaurant);
  }

  // getAllRestaurants(): Observable<any> {
  //   const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
  //   if (!token) {
  //     console.error('No token found in localStorage');
  //     return throwError('No token found');
  //   }
  //
  //   const headers = { 'Authorization': `Bearer ${token}` };  // Send only the token in the header
  //
  //   return this.http.get(`${this.baseUrl}/auth/users`, { headers });
  // }



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





  // // Create a new restaurant (POST request)
  // createRestaurant(restaurant: any): Observable<any> {
  //   const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
  //   if (!token) {
  //     console.error('No token found in localStorage');
  //     return throwError('No token found');
  //   }
  //
  //   const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  //
  //   return this.http.post(`${this.baseUrl}/restaurants`, restaurant, { headers }).pipe(
  //     catchError((error) => {
  //       console.error('Error creating restaurant:', error);
  //       return throwError(error);
  //     })
  //   );
  // }




}






// to afisa gia na kserw gia to loginUser , oti to pairnei pleon ws token kai oxi ws string
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//
//   private baseUrl: string = 'http://localhost:8080'; // Spring Boot backend URL
//   private isLoggedInSubject = new BehaviorSubject<boolean>(false);  // Track login status
//
//
//   constructor(private http: HttpClient) { }
//
//   // Observable to watch the login state
//   get isLoggedIn$(): Observable<boolean> {
//     return this.isLoggedInSubject.asObservable();
//   }
//
//   // Update the login state
//   setIsLoggedIn(status: boolean): void {
//     this.isLoggedInSubject.next(status);
//   }
//
//   // loginUser(user: any): Observable<string> {
//   //   return this.http.post(`${this.baseUrl}/auth/login`, user, { responseType: 'text' });
//   // }
//   loginUser(user: any): Observable<{ token: string }> {  // Explicitly typing the response
//     return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, user);  // Return an object with a token property
//   }
//
//
//   getAllUsers(): Observable<any> {
//     const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
//     if (!token) {
//       console.error('No token found in localStorage');
//       return throwError('No token found');
//     }
//
//     const headers = { 'Authorization': `Bearer ${token}` };  // Send only the token in the header
//
//     return this.http.get(`${this.baseUrl}/auth/users`, { headers });
//   }
//
//
//   // You can add more methods for POST, PUT, DELETE as needed
//   registerUser(user: any) {
//     return this.http.post(`${this.baseUrl}/auth/register`, user);
//   }
//
// }












// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//
//   private baseUrl: string = 'http://localhost:8080'; // Spring Boot backend URL
//   private isLoggedInSubject = new BehaviorSubject<boolean>(false);  // Track login status
//
//
//   constructor(private http: HttpClient) { }
//
//   // Observable to watch the login state
//   get isLoggedIn$(): Observable<boolean> {
//     return this.isLoggedInSubject.asObservable();
//   }
//
//   // Update the login state
//   setIsLoggedIn(status: boolean): void {
//     this.isLoggedInSubject.next(status);
//   }
//
//   loginUser(user: any): Observable<string> {
//     return this.http.post(`${this.baseUrl}/auth/login`, user, { responseType: 'text' });
//   }
//
//   getAllUsers(): Observable<any> {
//     const token = localStorage.getItem('authToken');  // Get token from local storage (or wherever it's stored)
//     const headers = { 'Authorization': `Bearer ${token}` };
//
//     return this.http.get(`${this.baseUrl}/api/users`, { headers });
//   }
//
//   // You can add more methods for POST, PUT, DELETE as needed
//   registerUser(user: any) {
//     return this.http.post(`${this.baseUrl}/auth/register`, user);
//   }
//
// }




//
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//
//   private baseUrl: string = 'http://localhost:8080'; // Spring Boot backend URL
//   private isLoggedInSubject = new BehaviorSubject<boolean>(false);  // Track login status
//
//
//   constructor(private http: HttpClient) { }
//
//   // Observable to watch the login state
//   get isLoggedIn$(): Observable<boolean> {
//     return this.isLoggedInSubject.asObservable();
//   }
//
//   // Update the login state
//   setIsLoggedIn(status: boolean): void {
//     this.isLoggedInSubject.next(status);
//   }
//
//   loginUser(user: any): Observable<string> {
//     return this.http.post(`${this.baseUrl}/auth/login`, user, { responseType: 'text' }).pipe(
//       catchError(this.handleError),
//       tap((response: any) => {
//         const token = response.token; // Extract the token
//         localStorage.setItem('authToken', token); // Store the raw token
//         console.log('Token retrieved from localStorage:', token); // Debugging log
//         this.setIsLoggedIn(true);
//       })
//     );
//   }
//
//   private handleError(error: any) {
//     if (error.status === 401) {
//       console.error('Unauthorized error:', error);
//       // Log the user out on unauthorized error
//       this.setIsLoggedIn(false);
//       localStorage.removeItem('authToken');
//       alert('Session expired. Please log in again.');
//     } else {
//       console.error('API error:', error);
//     }
//     return throwError(error);
//   }
//
//
//
//   private getAuthHeaders(): { [header: string]: string } {
//     const token = localStorage.getItem('authToken');
//     console.log('Token retrieved from localStorage:', token); // Debugging log
//     if (!token) {
//       throw new Error('No token found in localStorage');
//     }
//     return { Authorization: `Bearer ${token}` };
//   }
//
//   getAllUsers(): Observable<any> {
//     const headers = this.getAuthHeaders();
//     return this.http.get(`${this.baseUrl}/auth/users`, { headers }).pipe(
//       catchError(this.handleError)
//     );
//   }
//
//
//   // getAllUsers(): Observable<any> {
//   //   const token = localStorage.getItem('authToken');
//   //   console.log('Token being sent:', token); // Debug the token
//   //
//   //   if (!token) {
//   //     throw new Error('No token found in localStorage');
//   //   }
//   //
//   //   const headers = { Authorization: `Bearer ${token}` };
//   //   return this.http.get(`${this.baseUrl}/auth/users`, { headers });
//   // }
//
//   // You can add more methods for POST, PUT, DELETE as needed
//   registerUser(user: any) {
//     return this.http.post(`${this.baseUrl}/auth/register`, user);
//   }
//
// }
//





//
//
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {BehaviorSubject, Observable, tap} from 'rxjs';
// import { jwtDecode } from 'jwt-decode';  // Correct the function name
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//
//   private baseUrl: string = 'http://localhost:8080'; // Spring Boot backend URL
//   private isLoggedInSubject = new BehaviorSubject<boolean>(false);  // Track login status
//
//   constructor(private http: HttpClient) { }
//
//   // Observable to watch the login state
//   get isLoggedIn$(): Observable<boolean> {
//     return this.isLoggedInSubject.asObservable();
//   }
//
//   // Update the login state
//   setIsLoggedIn(status: boolean): void {
//     this.isLoggedInSubject.next(status);
//   }
//
//   // Get the user role from the token
//   getUserRole(): string | null {
//     const token = localStorage.getItem('jwtToken');
//     if (!token) {
//       return null;
//     }
//
//     try {
//       const decodedToken: any = jwtDecode(token);  // Decode the JWT token
//       return decodedToken.role;  // Extract the role from the decoded token
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   }
//
//   loginUser(user: any): Observable<string> {
//     return this.http.post(`${this.baseUrl}/auth/login`, user, { responseType: 'text' }).pipe(
//       tap(token => {
//         localStorage.setItem('jwtToken', token);  // Store token in localStorage
//         this.setIsLoggedIn(true);
//       })
//     );
//   }
//
//   getAllUsers(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/api/users`);
//   }
//
//   // Register user method
//   registerUser(user: any) {
//     return this.http.post(`${this.baseUrl}/auth/register`, user);
//   }
//
// }
