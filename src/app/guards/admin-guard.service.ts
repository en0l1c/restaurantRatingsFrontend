import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private apiService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);  // Redirect to login if no token
      return of(false);
    }

    return this.apiService.getCurrentUser().pipe(
      map((user) => {
        if (user && user.role === 0) {  // Admin check
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);  // Redirect on error
        return of(false);
      })
    );
  }

}
