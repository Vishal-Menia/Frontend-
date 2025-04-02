import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <!-- Header -->
      <header>
        <h1>Profile Explorer</h1>
        <div class="search-bar">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search profiles..."
            (input)="filterProfiles()"
          >
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <!-- Profile List -->
        <section class="profile-list">
          <div *ngFor="let profile of filteredProfiles" class="profile-card">
            <img [src]="profile.imageUrl" [alt]="profile.name">
            <div class="profile-info">
              <h3>{{ profile.name }}</h3>
              <p>{{ profile.description }}</p>
              <div class="profile-actions">
                <button (click)="showOnMap(profile)">View on Map</button>
                <button (click)="viewDetails(profile)">Details</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Map Section -->
        <section class="map-container">
          <div *ngIf="selectedProfile" class="map-placeholder">
            <h3>Map View: {{ selectedProfile.name }}</h3>
            <p>📍 {{ selectedProfile.address }}</p>
            <!-- In a real app, this would be your map component -->
            <div class="mock-map">
              <p>Map would display here with marker at:</p>
              <p>Lat: {{ selectedProfile.lat }}, Lng: {{ selectedProfile.lng }}</p>
            </div>
          </div>
          <div *ngIf="!selectedProfile" class="map-placeholder">
            <p>Select a profile to view on map</p>
          </div>
        </section>
      </main>

      <!-- Admin Panel (Toggleable) -->
      <div *ngIf="isAdmin" class="admin-panel">
        <h3>Admin Panel</h3>
        <div class="admin-form">
          <input [(ngModel)]="newProfile.name" placeholder="Name">
          <input [(ngModel)]="newProfile.description" placeholder="Description">
          <input [(ngModel)]="newProfile.address" placeholder="Address">
          <button (click)="addProfile()">Add Profile</button>
        </div>
      </div>

      <!-- Profile Details Modal -->
      <div *ngIf="detailedProfile" class="modal">
        <div class="modal-content">
          <span class="close" (click)="detailedProfile = null">&times;</span>
          <h2>{{ detailedProfile.name }}</h2>
          <img [src]="detailedProfile.imageUrl" [alt]="detailedProfile.name">
          <p><strong>Address:</strong> {{ detailedProfile.address }}</p>
          <p><strong>Contact:</strong> {{ detailedProfile.contact || 'Not provided' }}</p>
          <p><strong>Interests:</strong> {{ detailedProfile.interests?.join(', ') || 'None' }}</p>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .container { 
      font-family: Arial, sans-serif; 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 20px; 
    }
    .search-bar input { 
      padding: 8px; 
      width: 300px; 
    }
    main { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 20px; 
    }
    .profile-list { 
      display: grid; 
      gap: 15px; 
    }
    .profile-card { 
      border: 1px solid #ddd; 
      padding: 15px; 
      border-radius: 8px; 
      display: flex; 
      gap: 15px; 
    }
    .profile-card img { 
      width: 100px; 
      height: 100px; 
      object-fit: cover; 
      border-radius: 50%; 
    }
    .profile-actions { 
      margin-top: 10px; 
      display: flex; 
      gap: 10px; 
    }
    .map-container { 
      border: 1px solid #ddd; 
      padding: 15px; 
      border-radius: 8px; 
      height: 500px; 
    }
    .mock-map { 
      background: #f0f0f0; 
      height: 400px; 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      margin-top: 10px; 
    }
    .admin-panel { 
      margin-top: 30px; 
      padding: 15px; 
      background: #f5f5f5; 
      border-radius: 8px; 
    }
    .admin-form { 
      display: grid; 
      gap: 10px; 
      grid-template-columns: 1fr 1fr 1fr auto; 
    }
    .modal { 
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: rgba(0,0,0,0.5); 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      z-index: 1000; 
    }
    .modal-content { 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      max-width: 500px; 
      width: 100%; 
    }
    .loading { 
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: rgba(0,0,0,0.3); 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      z-index: 1000; 
    }
    .spinner { 
      border: 5px solid #f3f3f3; 
      border-top: 5px solid #3498db; 
      border-radius: 50%; 
      width: 50px; 
      height: 50px; 
      animation: spin 1s linear infinite; 
    }
    @keyframes spin { 
      0% { transform: rotate(0deg); } 
      100% { transform: rotate(360deg); } 
    }
    @media (max-width: 768px) {
      main { grid-template-columns: 1fr; }
      .admin-form { grid-template-columns: 1fr; }
    }
  `]
})
export class AppComponent implements OnInit {
  // Sample data
  profiles = [
    {
      id: '1',
      name: 'John Doe',
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      description: 'Software Engineer from San Francisco',
      address: 'Golden Gate Bridge, San Francisco, CA',
      lat: 37.8199,
      lng: -122.4783,
      contact: 'john@example.com',
      interests: ['Hiking', 'Photography']
    },
    {
      id: '2',
      name: 'Jane Smith',
      imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      description: 'Product Designer from New York',
      address: 'Times Square, New York, NY',
      lat: 40.7580,
      lng: -73.9855,
      contact: 'jane@example.com',
      interests: ['Painting', 'Travel']
    }
  ];

  // State management
  filteredProfiles = [...this.profiles];
  selectedProfile: any = null;
  detailedProfile: any = null;
  searchQuery = '';
  isLoading = false;
  isAdmin = false; // Toggle this to true to see admin panel
  newProfile = {
    name: '',
    description: '',
    address: ''
  };

  ngOnInit() {
    // Simulate loading data
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  filterProfiles() {
    this.filteredProfiles = this.profiles.filter(profile =>
      profile.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      profile.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      profile.address.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  showOnMap(profile: any) {
    this.selectedProfile = profile;
  }

  viewDetails(profile: any) {
    this.detailedProfile = profile;
  }

  addProfile() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      const newProfile = {
        ...this.newProfile,
        id: (this.profiles.length + 1).toString(),
        imageUrl: 'https://randomuser.me/api/portraits/lego/1.jpg',
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        contact: '',
        interests: []
      };
      this.profiles.push(newProfile);
      this.filteredProfiles = [...this.profiles];
      this.newProfile = { name: '', description: '', address: '' };
      this.isLoading = false;
    }, 800);
  }
}