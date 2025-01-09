// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../../services/api.service';
// import {HttpHeaders} from '@angular/common/http';
// import {Router} from '@angular/router'; // Use ApiService for fetching users
//
// @Component({
//   selector: 'app-users',
//   templateUrl: './users.component.html',
//   styleUrls: ['./users.component.css'],
//   standalone: false
// })
// export class UsersComponent implements OnInit {
//   users: any[] = [];
//
//   constructor(private apiService: ApiService, private router: Router) {}
//
//   ngOnInit(): void {
//     this.loadUsers(); // Load users on initialization
//   }
//
//   loadUsers(): void {
//     const token = localStorage.getItem('authToken');  // Retrieve token with the correct key
//     if (!token) {
//       console.error('No token found in localStorage');
//       return;
//     }
//
//     this.apiService.getAllUsers().subscribe({
//       next: (users: any[]) => {
//         console.log('Users fetched:', users); // Debug log
//
//         this.users = users;
//       },
//       error: (error: any) => {
//         console.error('Error loading users:', error);
//       },
//     });
//   }
//
//   // actions for the users
//   editUser(user: any): void {
//     user.isEditing = true;  // Enable edit mode
//
//     // Implement your edit functionality here
//     console.log('Edit user:', user);
//     // You can navigate to an edit page, or open a modal, etc.
//     this.router.navigate(['/edit-user', user.id]);  // Example of navigating to edit page
//   }
//
//   deleteUser(user: any): void {
//     const confirmation = confirm('Are you sure you want to delete this user?');
//     if (confirmation) {
//       this.apiService.deleteUser(user.id).subscribe({
//         next: () => {
//           console.log('User deleted');
//           this.loadUsers();  // Reload the user list to reflect the changes
//         },
//         error: (error) => {
//           console.error('Error deleting user:', error);
//         },
//       });
//     }
//   }
//
//   saveUser(user: any): void {
//     const updatedUser = {
//       ...user,
//       isEditing: false  // Disable edit mode after saving
//     };
//
//     this.apiService.updateUser(updatedUser).subscribe({
//       next: (response) => {
//         console.log('User updated:', response);
//         this.loadUsers();  // Reload the user list to reflect the changes
//       },
//       error: (error) => {
//         console.error('Error updating user:', error);
//       },
//     });
//   }
//
//   cancelEdit(user: any): void {
//     user.isEditing = false;  // Cancel editing, reverting any changes
//   }
//
//
// }



import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: false
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

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




















































