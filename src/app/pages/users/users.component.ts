import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: false
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private apiService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getCurrentUser().subscribe({
      next: (user) => {
        if (user.isAdmin) {
          this.loadUsers(); // Load users only if admin
        } else {
          console.log('Access denied: User is not an admin');
          this.router.navigate(['/home']);  // Redirect non-admins
        }
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.router.navigate(['/login']);  // Redirect to login on error
      },
    });
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users: any[]) => {
        console.log('Users fetched:', users);
        this.users = users;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      },
    });
  }

  // actions for the users
  editUser(user: any): void {
    user.isEditing = true;  // Enable edit mode
    this.router.navigate(['/edit-user', user.id]);
  }

  deleteUser(user: any): void {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      this.apiService.deleteUser(user.id).subscribe({
        next: () => {
          console.log('User deleted');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
    }
  }

  saveUser(user: any): void {
    const updatedUser = { ...user, isEditing: false };
    this.apiService.updateUser(updatedUser).subscribe({
      next: (response) => {
        console.log('User updated:', response);
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
      },
    });
  }

  cancelEdit(user: any): void {
    user.isEditing = false;
  }
}




















































