import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { AppRoutingModule } from './app-routing.module';  // Import the routing module
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
// to connect it with spring
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';
import { RestaurantCardComponent } from './components/restaurant-card/restaurant-card.component';
import { RestaurantCreateComponent } from './pages/restaurant-create/restaurant-create.component';
import { ReviewComponent } from './components/review/review.component';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,   // Declare components here
    NavbarComponent,
    //HomeComponent,
    RegisterComponent,
    LoginComponent,
    UsersComponent,
    //RestaurantCardComponent,
    RestaurantCreateComponent,
    RestaurantDetailComponent,
    ReviewComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    RestaurantCardComponent,
    HomeComponent,


  ],
  exports: [
    ReviewComponent
  ],

  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule {}
