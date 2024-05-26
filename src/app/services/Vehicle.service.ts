import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';
  private using = this.apiUrl

  constructor(private http: HttpClient) { }

  getVehicles(){
    return this.http.get<Vehicle[]>(`${this.using}/vehicle/vehicle`);
  }

  toggleFavorite(vehicle: Vehicle){
    return this.http.put<Vehicle>(`${this.using}/vehicle`, vehicle);
  }

  deleteVehicle(id: number){
    return this.http.delete(`${this.using}/vehicle/${id}`);
  }

  editVehicle(vehicle: Vehicle){
    return this.http.put<Vehicle>(`${this.using}/vehicle`, vehicle);
  }

  addVehicle(vehicle: Vehicle){
    return this.http.post<Vehicle>(`${this.using}/vehicle/vehicle`, vehicle);
  }
}
