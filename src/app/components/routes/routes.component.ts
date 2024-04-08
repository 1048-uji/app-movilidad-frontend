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
import { Vehicle } from '../../models/vehicle.model';

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
  errorMsg: string = '';
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
        this.savedVehicles = this.sortVehiclesByFavorite(data); // Ordenar por vehicle.favorite
      },
      (error) => {
        console.error('Error al obtener los vehículos:', error);
      }
    );
  }
  
  sortVehiclesByFavorite(vehicles: Vehicle[]): Vehicle[] {
    // Ordenar por vehicle.favorite, colocando los favoritos primero
    return vehicles.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1; // a es favorito, b no es favorito, a debe ir antes que b
      } else if (!a.fav && b.fav) {
        return 1; // b es favorito, a no es favorito, b debe ir antes que a
      } else {
        return 0; // Ambos son favoritos o ambos no son favoritos, no es necesario cambiar el orden
      }
    });
  }

  loadPlacesOfInterest() {
    this.placeOfInterestService.getPlacesOfInterest().subscribe(
      (data) => {
        this.savedPlacesOfInterest = this.sortPlacesByFav(data); // Ordenar por place.fav
      },
      (error) => {
        console.error('Error al obtener los lugares de interés:', error);
      }
    );
  }
  
  sortPlacesByFav(places: PlaceOfInterest[]): PlaceOfInterest[] {
    // Ordenar por place.fav, colocando los favoritos primero
    return places.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1; // a es favorito, b no es favorito, a debe ir antes que b
      } else if (!a.fav && b.fav) {
        return 1; // b es favorito, a no es favorito, b debe ir antes que a
      } else {
        return 0; // Ambos son favoritos o ambos no son favoritos, no es necesario cambiar el orden
      }
    });
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(
      (data) => {
        this.routes = data;
        this.filteredRoutes = this.sortRoutesByFavorite(data);
      },
      (error) => {
        console.error('Error al obtener las rutas:', error);
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
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
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
      this.errorMsg = '';
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
      }
    );
  }

  deleteRoute(id: number){
    this.routeService.deleteRoute(id).subscribe(
      () => {
        console.log('Éxito al eliminar:');
        this.loadRoutes();
      },
      (error) => {
        console.error('Error al eliminar', error);
      }
    );
  }

  cancelSave() {
    this.newRoute = new Route();
    this.editingRoute = new Route();
    this.showAddForm = false;
    this.showEditForm = false;
    this.errorMsg = '';
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
    options.startLat = startCoords[0];
    options.startLon = startCoords[1];
    options.startAddress  = start.address;
    options.endLat = endCoords[0];
    options.endLon = endCoords[1];
    options.endAddress  = end.address;
    this.routeService.createRoute(options).subscribe(
      (response) => {
          const route: Route = response
          this.showAddForm = false;
          this.sharedDataService.setRoute(route, null);
          this.errorMsg='';
      },
      (error) => {
          console.error('Error al crear la ruta: ', error);
          // Aquí puedes manejar el error si es necesario
      }
    );
  }
  sendRoute(route: Route){
    this.sharedDataService.setRoute(route, null);
  }

  getPrice(route: Route, vehicleId: string){
    console.log(vehicleId)
    this.routeService.getRoutePrice(route, parseInt(vehicleId)).subscribe(
      (response) => {
          this.sharedDataService.setRoute(route, response);
      },
      (error) => {
          console.error('Error al obtener el precio: ', error);
          // Aquí puedes manejar el error si es necesario
      }
    );
  }
}
