import { ElectricMotor } from '../src/models/electric-motor';
import { DieselCar } from '../src/models/diesel-car';
import { TurboEngine } from '../src/models/turbo-engine';
import { ElectricCar } from '../src/models/electric-car';

describe('Vehicles', () => {
    test('Diesel car returns the right engine', () => {
        const engine = new TurboEngine();
        const car = new DieselCar('Audi', 'Q7', engine);

        expect(car.getEngine()).toBe(engine);
    });
    test('Electric car returns the right engine', () => {
        const engine = new ElectricMotor();
        const car = new ElectricCar('Tesla', 'Model Y', engine);

        expect(car.getEngine()).toBe(engine);
    });
});

describe('Engines', () => {
    test('Turbo engine has efficiency of 70%', () => {
        const engine = new TurboEngine();
        expect(engine.getEfficiency()).toBe(70);
    });
    test('Electric motor "toString" method contains info about its efficiency', () => {
        const motor = new ElectricMotor();
        expect(motor.toString()).toEqual(expect.stringContaining(`Efficiency: ${motor.getEfficiency()}%`));
    });
});
