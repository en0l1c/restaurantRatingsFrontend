import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { AppRoutingModule } from './app-routing.module';  // Import the routing module

// Import components here
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './components/register/register.component';
// to connect it with spring
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';
import { RestaurantCardComponent } from './components/restaurant-card/restaurant-card.component';
import { RestaurantCreateComponent } from './components/restaurant-create/restaurant-create.component';
import { ReviewComponent } from './components/review/review.component';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,   // Declare components here
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    UsersComponent,
    RestaurantCardComponent,
    RestaurantCreateComponent,
    RestaurantDetailComponent,
    ReviewComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,  // Use AppRoutingModule here instead of declaring routes in app.module.ts
    HttpClientModule,
    CommonModule,
  ],
  exports: [
    ReviewComponent
  ],

  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule {}
