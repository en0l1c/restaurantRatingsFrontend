// // restaurant-card.component.ts
// import { Component, OnInit } from '@angular/core';
// import { RestaurantService} from '../../services/restaurant.service';
// import { Restaurant} from '../../restaurant.model';
//
// @Component({
//   selector: 'app-restaurant-card',
//   templateUrl: './restaurant-card.component.html',
//   styleUrls: ['./restaurant-card.component.css'],
//
//   standalone: false,
// })
// export class RestaurantCardComponent implements OnInit {
//   restaurants: Restaurant[] = [];
//
//   constructor(private restaurantService: RestaurantService) {}
//
//   ngOnInit(): void {
//     this.restaurantService.getRestaurants().subscribe((data) => {
//       this.restaurants = data;
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import {Observable, throwError} from 'rxjs';
import {ApiService} from '../../services/api.service';  // Add FormsModule


@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css'],
  standalone: false
})
export class RestaurantCardComponent implements OnInit {

  restaurants: any[] = [];
  isLoggedIn: boolean = false;

  isAdmin = true; // Set this based on your actual authentication or user role logic
  user: any;

  constructor(private apiService: ApiService, private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      }
    });

  // show the edit/delete buttons only to admins:
    this.apiService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;  // Update the navbar whenever login state changes
      if (this.isLoggedIn) {
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.user = user;
            console.log('Logged-in User:', this.user); // Debug log
            this.isAdmin = user.role === 0;  // Set isAdmin based on role (0 for admin)
          },
          error: (err) => {
            console.error('Error fetching user in navbar:', err); // Debug log
          },
        });
      } else {
        this.user = null;  // Reset the user if logged out
        this.isAdmin = false;  // Reset admin status if logged out
      }
    });
  }

  loadRestaurants(): void {
    // Assuming you have a service method to get all restaurants
    this.restaurantService.getAllRestaurants().subscribe(
      (data) => {
        this.restaurants = data;
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
      }
    );
  }


/** to be changed !!!!!! **/
  editRestaurant(restaurant: any): void {
    // Logic to edit the restaurant, perhaps navigating to an edit form
    console.log('Editing restaurant:', restaurant);
    // Example: Navigate to edit page with restaurant ID
    // this.router.navigate(['/edit-restaurant', restaurant.id]);
  }

  // deleteRestaurant(restaurant: any): void {
  //   // Logic to delete the restaurant
  //   console.log('Deleting restaurant:', restaurant);
  //   // Example: Call a service method to delete the restaurant
  //   this.restaurantService.deleteRestaurant(restaurant.id).subscribe(
  //     () => {
  //       // Remove the deleted restaurant from the UI
  //       console.log('Deleting restaurant:', restaurant);
  //       this.restaurants = this.restaurants.filter(r => r.id !== restaurant.id);
  //     },
  //     (error) => {
  //       console.error('Error deleting restaurant:', error);
  //     }
  //   );
  // }

  deleteRestaurant(restaurant: any): void {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      this.restaurantService.deleteRestaurant(restaurant.id).subscribe({
        next: () => {
          console.log('Restaurant deleted');
          this.loadRestaurants();
        },
        error: (error) => {
          console.error('Error deleting restaurant:', error);
        },
      });
    }
  }

}
















