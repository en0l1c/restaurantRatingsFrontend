import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { AverageRatingService } from '../../services/average-rating.service';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { NgIf } from '@angular/common';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: true,
  imports: [RestaurantCardComponent, NgIf],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  restaurants: Restaurant[] = [];
  averageRatings: { [key: number]: number } = {};
  private destroy$ = new Subject<void>();
  isAdmin = false;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private averageRatingService: AverageRatingService,
    private apiService: AuthService,
  ) {}

  ngOnInit(): void {
    // Check if is Admin
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


    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const query = params['q'];
      if (query) {
        this.restaurantService.searchRestaurants(query)
          .pipe(
            takeUntil(this.destroy$),
            switchMap(restaurants => {
              this.restaurants = restaurants;
              return this.averageRatingService.calculateAndSetAverageRatings(this.restaurants);
            })
          )
          .subscribe(updatedRestaurants => {
            this.restaurants = updatedRestaurants;
            this.averageRatingService.averageRatings$.pipe(takeUntil(this.destroy$))
              .subscribe(ratings => this.averageRatings = ratings);
          });
      }
    });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
