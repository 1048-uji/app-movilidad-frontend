import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaceOfInterest } from '../models/place-of-interest.model';
import { Route } from '../models/route.model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private placeOfInterestDataSubject = new BehaviorSubject<PlaceOfInterest | null>(null);
  placeOfInterest$ = this.placeOfInterestDataSubject.asObservable();

  private routeDataSubject = new BehaviorSubject<{ route: Route, price: number | null } | null>(null);
  route$ = this.routeDataSubject.asObservable();

  constructor() { }

  setPlaceOfInterest(savePlace: PlaceOfInterest) {
    this.placeOfInterestDataSubject.next(savePlace);
  }

  deletePlaceofInterest(){
    this.placeOfInterestDataSubject.next(null);
  }

  setRoute(saveRoute: Route, price: number | null) {
    // Almacena tanto la ruta como el precio en un objeto
    const routeData = { route: saveRoute, price: price };
    this.routeDataSubject.next(routeData);
  }

  deleteRoute(){
    this.placeOfInterestDataSubject.next(null);
  }
}