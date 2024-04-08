import { User } from "./user.model";

// place-of-interest.model.ts
export class PlaceOfInterest {
    id: number = 0;
    name: string = '';
    lon: string = '';
    lat: string = '';
    address: string = '';
    region?: string;
    macroregion?: string;
    localadmin?: string;
    country: string = '';
    fav: boolean = false;
    userId?: number;
    user?: User;
}
