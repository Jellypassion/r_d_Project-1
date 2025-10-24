import { Vehicle } from '../models/vehicle';
import { IEngine } from './i-engine';

export interface IVehicleService {
    inspect(vehicle: Vehicle): void;
    reenergize(vehicle: Vehicle): void;
    service(engine: IEngine): void;
}
