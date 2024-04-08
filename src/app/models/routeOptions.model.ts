import { VehicleType } from "./route.model";
import { Strategy } from "./user.model";

export class RouteOptions {
    startLon?: string;
    startLat?: string;
    startAddress?: string;
    endLon?: string;
    endLat?: string;
    endAddress?: string;
    strategy: Strategy = Strategy.FAST;
    vehicleType: VehicleType = VehicleType.DRIVING_CAR
}