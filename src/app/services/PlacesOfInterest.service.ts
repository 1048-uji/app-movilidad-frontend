import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PlaceOfInterest } from '../models/place-of-interest.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceOfInterestService {
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';
  private using = this.apiUrl

  constructor(private http: HttpClient) { }

  // Método para obtener todos los lugares de interés del usuario
  getPlacesOfInterest() {
    return this.http.get<PlaceOfInterest[]>(this.using+'/place-of-interest/place-of-interest');
  }

  toggleFavorite(place: PlaceOfInterest) {
    return this.http.put<PlaceOfInterest>(this.using+'/place-of-interest/deleteFav', place);
  }

  deletePlace(id: number) {
    return this.http.delete(this.using+'/place-of-interest/'+id);
  }

  editPlace(place: PlaceOfInterest) {
    return this.http.put<PlaceOfInterest>(this.using+'/place-of-interest/deleteFav', place);
  }

  getAddressByCoordinates(place: PlaceOfInterest){
    return this.http.post<{lat: string, lng:string, address: string}>(this.using+'/place-of-interest/Poi', place);
  }

  addByCoordinates(place: PlaceOfInterest){
    return this.http.post<PlaceOfInterest>(this.using+'/place-of-interest/coords', place);
  }

  addByAddress(place: PlaceOfInterest){
    return this.http.post<PlaceOfInterest>(this.using+'/place-of-interest/address', place);
  }
}
