import { PlaceOfInterest } from "./place-of-interest.model";
import { Route } from "./route.model";
import { Vehicle } from "./vehicle.model";

export class User {
    id: number = 0;
    email: string = '';
    username: string = '';
    password: string = '';
    placesOfInterest?: PlaceOfInterest[] = [];
    vehicles?: Vehicle[] = [];
    vehicleDefault?: Vehicle = new Vehicle();
    routeDefault: Strategy = Strategy.RECOMMENDED;
    routes?: Route[] = [];
}

export enum Strategy {
    FAST = 'fast',
    RECOMMENDED = 'recommended',
    SHORT = 'short',
  }