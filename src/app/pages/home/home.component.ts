import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { AverageRatingService } from '../../services/average-rating.service';
import { Restaurant } from '../../models/restaurant.model';
import {
  Subject,
  switchMap,
  takeUntil,
  forkJoin,
  map,
  of,
  tap,
  combineLatest,
} from 'rxjs';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RestaurantCardComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  restaurants: Restaurant[] = [];
  averageRatings: { [key: number]: number } = {};
  private destroy$ = new Subject<void>();
  isAdmin = false;
  user: any;
  isLoggedIn: boolean = false;

  constructor(
    private restaurantService: RestaurantService,
    private averageRatingService: AverageRatingService,
    private apiService: AuthService
  ) {}

  ngOnInit(): void {
    this.apiService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isLoggedIn = status;
      });

    this.apiService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });

    this.apiService.isAdmin$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });

    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService
      .getAllRestaurants()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((restaurants) => {
          this.restaurants = restaurants;
          return this.averageRatingService.calculateAndSetAverageRatings(
            this.restaurants
          );
        })
      )
      .subscribe({
        next: (updatedRestaurants) => {
          this.restaurants = updatedRestaurants;
          this.averageRatingService.averageRatings$
            .pipe(takeUntil(this.destroy$))
            .subscribe((ratings) => (this.averageRatings = ratings));
        },
        error: (err) => {
          console.error('Error fetching restaurants:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
