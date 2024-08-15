import { Component, Input, OnInit } from '@angular/core';
import { Route} from '../../models/route.model';
import { RouteService } from '../../services/Route.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../services/sharedData.service';
import { CommonModule } from '@angular/common';
import { Strategy } from '../../models/user.model';
import { RouteOptions } from '../../models/routeOptions.model';
import { PlaceOfInterest } from '../../models/place-of-interest.model';
import { PlaceOfInterestService } from '../../services/PlacesOfInterest.service';
import { VehicleService } from '../../services/Vehicle.service';
import { CarbType, Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  searchTerm: string = '';
  routes: Route[] = [new Route()];
  filteredRoutes: Route[] = [];
  showEditForm: boolean = false;
  newName: string = '';
  showAddForm: boolean = false;
  newRoute = new Route();
  editingRoute: Route = new Route();
  errorMsg: string | null = null;
  strategyOptions: string[] = Object.values(Strategy);
  newRouteOptions: RouteOptions = new RouteOptions();
  newStartPlace: PlaceOfInterest = new PlaceOfInterest();
  newEndPlace: PlaceOfInterest = new PlaceOfInterest();
  startType: string = 'new';
  endType: string = 'new';
  savedPlacesOfInterest: PlaceOfInterest[] = [];
  savedVehicles: Vehicle[] = [];
  startCoords: string = '';
  endCoords: string = '';

  constructor(private routeService: RouteService, private sharedDataService: SharedDataService, private placeOfInterestService: PlaceOfInterestService, private vehicleService: VehicleService) {}

  ngOnInit(): void {
      this.loadRoutes();
      this.loadPlacesOfInterest() 
      this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (data) => {
        this.savedVehicles = this.sortVehiclesByFavorite(data);
      },
      (error) => {
        console.error('Error al obtener los vehículos:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }
  
  sortVehiclesByFavorite(vehicles: Vehicle[]): Vehicle[] {
    return vehicles.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1;
      } else if (!a.fav && b.fav) {
        return 1; 
      } else {
        return 0;
      }
    });
  }

  loadPlacesOfInterest() {
    this.placeOfInterestService.getPlacesOfInterest().subscribe(
      (data) => {
        this.savedPlacesOfInterest = this.sortPlacesByFav(data);
      },
      (error) => {
        console.error('Error al obtener los lugares de interés:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }
  
  sortPlacesByFav(places: PlaceOfInterest[]): PlaceOfInterest[] {
    return places.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1; 
      } else if (!a.fav && b.fav) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(
      (data) => {
        this.routes = data;
        this.filteredRoutes = this.sortRoutesByFavorite(data);
        this.errorMsg = null;
      },
      (error) => {
        console.error('Error al obtener las rutas:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }

  
  sortRoutesByFavorite(routes: Route[]): Route[] {
    return routes.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1;
      } else if (!a.fav && b.fav) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  search() {
      this.filteredRoutes = (this.searchTerm === '' ? this.routes : this.routes.filter(route =>
        route.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      ));
  }

  toggleFavorite(route: Route){
    route.fav = !route.fav;
    this.routeService.toggleFavorite(route).subscribe(
      (response) => {
        this.loadRoutes();
        this.errorMsg = null;
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }

  showEditInput(route: Route) {
    this.editingRoute = route;
    this.showEditForm = true;
}

  editRoute(name: string): void {
    this.editingRoute.name = name;
    this.routeService.editRoute(this.editingRoute).subscribe((response) =>{
      this.editingRoute = new Route();
      this.loadRoutes();
      this.newRoute = new Route();
      this.editingRoute = new Route();
      this.showAddForm = false;
      this.showEditForm = false;
      this.errorMsg = null;
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }

  deleteRoute(id: number){
    this.routeService.deleteRoute(id).subscribe(
      () => {
        this.loadRoutes();
        this.errorMsg = null;
      },
      (error) => {
        console.error('Error al eliminar', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }

  cancelSave() {
    this.newRoute = new Route();
    this.editingRoute = new Route();
    this.showAddForm = false;
    this.showEditForm = false;
    this.errorMsg = null;
}

  addRoute(start: PlaceOfInterest, end: PlaceOfInterest, options: RouteOptions, startCoords: string, endCoords: string){
    if (startCoords !== '') {
      const startCoordsSplit: string[] = startCoords.split(',');
      start.lat = startCoordsSplit[0];
      start.lon = startCoordsSplit[1];
      start.address  = start.address;
      this.startCoords='';
    }
    
    if (endCoords !== '') {
      const endCoordsSplit: string[] = endCoords.split(',');
      end.lat = endCoordsSplit[0];
      end.lon = endCoordsSplit[1];
      end.address  = end.address;
      this.endCoords='';
    }
    options.startLat = start.lat;
    options.startLon = start.lon;
    options.startAddress  = start.address;
    options.endLat = end.lat;
    options.endLon = end.lon;
    options.endAddress  = end.address;
    this.routeService.createRoute(options).subscribe(
      (response) => {
          const route: Route = response
          this.showAddForm = false;
          this.sharedDataService.setRoute(route, null);
          this.errorMsg = null;
      },
      (error) => {
          console.error('Error al crear la ruta: ', error);
          this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }
  sendRoute(route: Route){
    this.sharedDataService.setRoute(route, null);
  }

  getPrice(route: Route, vehicle: string){
    const vehicleData = vehicle.split(`,`);
    this.routeService.getRoutePrice(route, parseInt(vehicleData[0])).subscribe(
      (response) => {
        const price = response + (vehicleData[1] === CarbType.Calories ? " kcal" : " €");
        this.sharedDataService.setRoute(route, price);
        this.errorMsg = null;
      },
      (error) => {
          console.error('Error al obtener el precio: ', error);
          this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }
}
