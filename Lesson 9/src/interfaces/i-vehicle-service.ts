import { Vehicle } from '../models/vehicle';

export interface IVehicleService {
    inspect(vehicle: Vehicle): void;
    reenergize(vehicle: Vehicle): void;
}
