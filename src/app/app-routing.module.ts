import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { RegisterComponent } from './components/register/register.component';
import {LoginComponent} from './components/login/login.component'; // Import RegisterComponent
import { UsersComponent } from './components/users/users.component';  // Import the Users component
import { AdminGuard} from './guards/admin-guard.service';
import { RestaurantCardComponent } from './components/restaurant-card/restaurant-card.component';
import { RestaurantDetailComponent} from './pages/restaurant-detail/restaurant-detail.component';
import { RestaurantCreateComponent } from './components/restaurant-create/restaurant-create.component';

const routes: Routes = [
  {
    path: 'create',
    component: RestaurantCreateComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard],
  },
  { path: '', component: RestaurantCardComponent },  // Default route, Home page
  // { path: 'home', component: HomeComponent },  // Explicit Home route
  //{ path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
  { path: 'users', component: UsersComponent },
  { path: 'auth', component: AuthComponent },  // Login route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },  // Register route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/restaurant-card', pathMatch: 'full' },
  { path: 'restaurant-create', component: RestaurantCreateComponent },
  { path: 'home', component: RestaurantCardComponent },
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  // { path: '**', redirectTo: '/home' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Register routes
  exports: [RouterModule]
})
export class AppRoutingModule { }
