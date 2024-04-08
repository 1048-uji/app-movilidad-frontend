import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceOfInterestComponent } from '../place-of-interest/place-of-interest.component';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { RoutesComponent } from '../routes/routes.component';
import { SharedDataService } from '../../services/sharedData.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, PlaceOfInterestComponent, VehicleComponent, RoutesComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  username: string = '';
  showPlaces: boolean = false;
  showVehicles: boolean = false;
  showRoutes: boolean = false;
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
  loginOut() {
    sessionStorage.removeItem('token');
    window.location.reload();
  }
  isLoggedIn(): boolean{
    return sessionStorage.getItem('token') !== null;
  }
  showDetails(type: string): void {
    switch(type){
      case  "places":
        this.showPlaces = !this.showPlaces;
        this.showRoutes = false;
        this.showVehicles = false;
        break;
      case "vehicles":
        this.showVehicles = !this.showVehicles;
        this.showRoutes = false;
        this.showPlaces = false;
        break;
      case  "routes":
        this.showRoutes = !this.showRoutes;
        this.showPlaces = false;
        this.showVehicles = false;
        break
    }
  }
}
