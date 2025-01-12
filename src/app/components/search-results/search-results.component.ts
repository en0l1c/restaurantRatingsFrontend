// search-results.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../restaurant.model';
import { Subject, takeUntil } from 'rxjs';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  imports: [
    NgIf,
    NgForOf
  ]
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  restaurants: Restaurant[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const query = params['q'];
      if (query) {
        this.restaurantService
          .searchRestaurants(query)
          .subscribe((restaurants) => {
            this.restaurants = restaurants;
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
