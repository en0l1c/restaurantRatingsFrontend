import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Add CommonModule

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent {
  searchQuery: string = ''; // Mock property for demonstration purposes
}
