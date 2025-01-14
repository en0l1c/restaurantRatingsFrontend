import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Restaurant } from '../../models/restaurant.model';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css'],
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DecimalPipe],
})
export class RestaurantCardComponent {
  @Input() restaurants: Restaurant[] = [];
  @Input() averageRatings: { [key: number]: number } = {};
  @Input() isAdmin = false; // Directly use this Input property
  editMode: 'detail' | 'create' | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  editRestaurant(restaurant: Restaurant): void {
    console.log('Editing restaurant:', restaurant);
    this.editMode = 'create';
    if (this.editMode === 'create') {
      this.router.navigate(['/restaurant-create'], {
        queryParams: { id: restaurant.id },
      });
    } else if (this.editMode === 'detail') {
      this.router.navigate(['/restaurant', restaurant.id]);
    }
  }

  deleteRestaurant(restaurant: Restaurant): void {
    const confirmation = confirm(
      'Are you sure you want to delete this restaurant?'
    );
    if (confirmation) {
      this.restaurantService.deleteRestaurant(restaurant.id!).subscribe({
        next: () => {
          console.log('Restaurant deleted');
          this.restaurants = this.restaurants.filter(
            (r) => r.id !== restaurant.id
          );
        },
        error: (error) => {
          console.error('Error deleting restaurant:', error);
        },
      });
    }
  }
}
