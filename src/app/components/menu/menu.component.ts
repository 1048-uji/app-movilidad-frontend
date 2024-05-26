import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceOfInterestComponent } from '../place-of-interest/place-of-interest.component';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { RoutesComponent } from '../routes/routes.component';
import { SharedDataService } from '../../services/sharedData.service';
import { jwtDecode } from 'jwt-decode';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, PlaceOfInterestComponent, VehicleComponent, RoutesComponent, ProfileComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  username: string = '';
  decodedToken: { id: number, email: string , username: string} = {id: 0, email: '', username: ''};
  showPlaces: boolean = false;
  showVehicles: boolean = false;
  showRoutes: boolean = false;
  showProfile: boolean = false;
  constructor(private router: Router, private sharedDataService: SharedDataService) {}

  ngOnInit(): void{
    this.sharedDataService.placeOfInterest$.subscribe((placeOfInterest) => {
      if (placeOfInterest !== undefined && placeOfInterest !== null){
        this.showPlaces = true;
      }
      
    });
  }
  login() {
    this.router.navigate(['/login']);
  }
  logout() {
    sessionStorage.removeItem('token');
    window.location.reload();
  }
  isLoggedIn(): boolean{
    const token: string | null = sessionStorage.getItem('token')
    if(token !== null){
      this.decodedToken = jwtDecode(token);
      return true;
    }
    return false;
  }
  showDetails(type: string): void {
    switch(type){
      case  "places":
        this.showPlaces = !this.showPlaces;
        this.showRoutes = false;
        this.showVehicles = false;
        this.showProfile = false;
        break;
      case "vehicles":
        this.showVehicles = !this.showVehicles;
        this.showRoutes = false;
        this.showPlaces = false;
        this.showProfile = false;
        break;
      case  "routes":
        this.showRoutes = !this.showRoutes;
        this.showPlaces = false;
        this.showVehicles = false;
        this.showProfile = false;
        break;
      case  "profile":
        this.showProfile = !this.showProfile;
        this.showPlaces = false;
        this.showVehicles = false;
        this.showRoutes = false;
        break;
    }
  }
}
