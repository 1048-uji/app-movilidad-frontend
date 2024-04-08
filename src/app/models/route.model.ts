import { Strategy, User } from "./user.model";

export class Route {
    id: number = 0;
    name: string = '';
    path: string = '';
    distance: string = '';
    duration: string = '';
    start: string = '';
    end: string = '';
    geometry: string[] = []; // [latitude, longitude] pairs
    fav: boolean = false;
    type: Strategy = Strategy.RECOMMENDED;
    userId?: number;
    user: User = new User();
}
  
  export enum VehicleType {
    DRIVING_CAR = 'driving-car',
    DRIVING_HGV = 'driving-hgv',
    CYCLING_REGULAR = 'cycling-regular',
    CYCLING_ROAD = 'cycling-road',
    CYCLING_MOUNTAIN = 'cycling-mountain',
    CYCLING_ELECTRIC = 'cycling-electric',
    FOOT_WALK = 'foot-walking',
    FOOT_HIKING = 'foot-hiking',
    WHEELCHAIR = 'wheelchair',
  }
