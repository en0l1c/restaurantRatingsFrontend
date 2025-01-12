import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from '../../restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-restaurant-create',
  templateUrl: './restaurant-create.component.html',
  styleUrls: ['./restaurant-create.component.css'],
  standalone: false
})
export class RestaurantCreateComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  restaurantId: number | null = null;
  isEditing: boolean = false;

  // Separate properties for the form
  name: string = '';
  address: string = '';
  phone: string = '';
  description: string = '';
  averageRating: number = 0;
  image: string = '';

  restaurant: Restaurant = {
    id: 0,
    name: '',
    address: '',
    phone: '',
    description: '',
    averageRating: 0,
    image: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.restaurantId = +params['id'];
        this.isEditing = true;
        this.loadRestaurantForEdit(this.restaurantId);
      }
    });
  }

  loadRestaurantForEdit(restaurantId: number): void {
    this.restaurantService.getRestaurantById(restaurantId).subscribe({
      next: (restaurant) => {
        // this.restaurant = { ...restaurant };
        this.name = restaurant.name;
        this.address = restaurant.address;
        this.phone = restaurant.phone;
        this.description = restaurant.description;
        this.averageRating = restaurant.averageRating;
        this.image = restaurant.image;
      },
      error: (error) => {
        console.error('Error fetching restaurant for edit:', error);
      }
    });
  }

  onSubmit() {
    if (this.isEditing) {
      this.restaurant = {
        id: this.restaurantId!, // Now it's safe to use restaurantId
        name: this.name,
        address: this.address,
        phone: this.phone,
        description: this.description,
        averageRating: this.averageRating,
        image: this.image
      };
      this.restaurantService.updateRestaurant(this.restaurant).subscribe({
        next: (response) => {
          console.log('Restaurant updated:', response);
          this.router.navigate(['/restaurant', this.restaurantId]);
        },
        error: (error) => {
          console.error('Error updating restaurant:', error);
          this.errorMessage = 'Restaurant update failed. Please try again later.';
        }
      });
    } else {
      const newRestaurant: Restaurant = {
        //id: 0,
        name: this.name,
        address: this.address,
        phone: this.phone,
        description: this.description,
        averageRating: this.averageRating,
        image: this.image,
      };

      this.restaurantService.registerRestaurant(newRestaurant).subscribe({
        next: (response) => {
          console.log('Restaurant creation successful', response);
          this.successMessage = 'Restaurant added successfully!';
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Restaurant creation failed', error);
          if (error.error) {
            console.error('Error message from backend:', error.error);
          }
          this.errorMessage = 'Restaurant addition failed. Please try again later.';
        }
      });
    }
  }
}

