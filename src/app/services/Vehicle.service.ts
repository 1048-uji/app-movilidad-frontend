import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getVehicles(){
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicle/vehicle`);
  }

  toggleFavorite(vehicle: Vehicle){
    return this.http.put<Vehicle>(`${this.apiUrl}/vehicle`, vehicle);
  }

  deleteVehicle(id: number){
    return this.http.delete(`${this.apiUrl}/vehicle/${id}`);
  }

  editVehicle(vehicle: Vehicle){
    return this.http.put<Vehicle>(`${this.apiUrl}/vehicle`, vehicle);
  }

  addVehicle(vehicle: Vehicle){
    return this.http.post<Vehicle>(`${this.apiUrl}/vehicle/vehicle`, vehicle);
  }
}
