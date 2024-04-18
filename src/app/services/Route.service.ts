import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route } from '../models/route.model';
import { PlaceOfInterest } from '../models/place-of-interest.model';
import { RouteOptions } from '../models/routeOptions.model';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getRoutes(){
    return this.http.get<Route[]>(`${this.apiUrl}/routes/myroutes`);
  }

  toggleFavorite(route: Route){
    return this.http.put<Route>(`${this.apiUrl}/routes/addFav`, route);
  }

  deleteRoute(id: number){
    return this.http.delete(`${this.apiUrl}/routes/${id}`);
  }

  editRoute(route: Route){
    return this.http.put<Route>(`${this.apiUrl}/routes/addFav`, route);
  }

  createRoute(options: RouteOptions){
    return this.http.post<Route>(`${this.apiUrl}/routes/route`, options);
  }
  saveRoute(route: Route){
    return this.http.post<Route>(`${this.apiUrl}/routes/save`, route);
  }

  getRoutePrice(route: Route, vehicleId: number){
    return this.http.post<number>(`${this.apiUrl}/routes/Price/${vehicleId}`, route);
  }
}
