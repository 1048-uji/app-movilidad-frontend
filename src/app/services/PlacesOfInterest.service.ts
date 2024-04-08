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

  constructor(private http: HttpClient) { }

  // Método para obtener todos los lugares de interés del usuario
  getPlacesOfInterest() {
    return this.http.get<PlaceOfInterest[]>(this.apiUrl+'/place-of-interest/place-of-interest');
  }

  toggleFavorite(place: PlaceOfInterest) {
    return this.http.put<PlaceOfInterest>(this.apiUrl+'/place-of-interest/deleteFav', place);
  }

  deletePlace(id: number) {
    return this.http.delete(this.apiUrl+'/place-of-interest/'+id);
  }

  editPlace(place: PlaceOfInterest) {
    return this.http.put<PlaceOfInterest>(this.apiUrl+'/place-of-interest/deleteFav', place);
  }

  getAddressByCoordinates(place: PlaceOfInterest){
    return this.http.post<{lat: string, lng:string, address: string}>(this.apiUrl+'/place-of-interest/Poi', place);
  }

  addByCoordinates(place: PlaceOfInterest){
    return this.http.post<PlaceOfInterest>(this.apiUrl+'/place-of-interest/coords', place);
  }

  addByAddress(place: PlaceOfInterest){
    return this.http.post<PlaceOfInterest>(this.apiUrl+'/place-of-interest/address', place);
  }
}
