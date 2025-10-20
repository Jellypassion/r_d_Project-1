import { DieselCar } from './models/diesel-car';
import { ElectricCar } from './models/electric-car';
import { VehicleService } from './services/vehicle-service';
import { ElectricMotor } from './models/electric-motor';
import { TurboEngine } from './models/turbo-engine';

const electric = new ElectricCar('Tesla', 'Model 3', new ElectricMotor());
const diesel = new DieselCar('BMW', 'X5', new TurboEngine());

const service = new VehicleService();

electric.drive();
electric.accelerate(60);
console.log('Battery status: ' + electric.getBatteryStatus());

diesel.drive();
console.log('Fuel level: ' + diesel.getFuelLevel());
diesel.refuel();
console.log('Fuel level: ' + diesel.getFuelLevel());

service.inspect(diesel);
service.reenergize(electric);
