import { IVehicleService } from '../interfaces/i-vehicle-service';
import { Vehicle } from '../models/vehicle';

export class VehicleService implements IVehicleService {
    public inspect(vehicle: Vehicle): void {
        console.log(`Inspecting: ${vehicle.getInfo()} with ${vehicle.getEngineInfo()}`);
    }

    public reenergize(vehicle: Vehicle): void {
        vehicle.reenergize();
    }
}
