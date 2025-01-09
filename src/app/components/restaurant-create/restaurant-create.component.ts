import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Restaurant } from '../../restaurant.model';

@Component({
  selector: 'app-restaurant-create',
  templateUrl: './restaurant-create.component.html',
  styleUrls: ['./restaurant-create.component.css'],
  standalone: false
})
export class RestaurantCreateComponent {

    //id: 0, // will be set by the backend
    name: string = '';
    address: string = '';
    phone: string = '';
    description: string = '';
    averageRating: number = 0; // default value
    image: string = '';
    successMessage: string = '';
    errorMessage: string = '';


  constructor(private apiService: ApiService, private router: Router) {}

  // onRegister() {
  //   const newRestaurant = {
  //     name: this.name,
  //     address: this.address,
  //     phone: this.phone,
  //     description: this.description,
  //     averageRating: this.averageRating,
  //     image: this.image
  //   };
  // }

  onSubmit() {

    const newRestaurant = {
      name: this.name,
      address: this.address,
      phone: this.phone,
      description: this.description,
      averageRating: this.averageRating,
      image: this.image
    };

    this.apiService.registerRestaurant(newRestaurant).subscribe({
      next: (response) => {
        // Log and handle success response
        console.log('Registration successful', response);
        this.successMessage = 'Restaurant added successfully! You can now log in.';

        // Redirect to login page after a delay
        // setTimeout(() => {
        //   this.router.navigate(['/login']);
        // }, 2000);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        // Log error response and handle error
        console.error('Restaurant creation failed', error);
        if (error.error) {
          console.error('Error message from backend:', error.error);  // Log the actual error message
        }
        this.errorMessage = 'Restaurant addition failed. Please try again later.';
      }
    });









    // this.apiService.registerRestaurant(this.restaurant).subscribe(
    //   (response) => {
    //     console.log('Restaurant created:', response);
    //     this.router.navigate(['/home']); // Redirect to home or any page you want
    //   },
    //   (error) => {
    //     console.error('Error creating restaurant:', error);
    //   }
    // );
  }




}
