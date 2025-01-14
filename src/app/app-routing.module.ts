import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminGuard } from './guards/admin-guard.service';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';
import { RestaurantCreateComponent } from './pages/restaurant-create/restaurant-create.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

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
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'restaurant-create', component: RestaurantCreateComponent },
  { path: 'home', component: HomeComponent },
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  //{ path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
