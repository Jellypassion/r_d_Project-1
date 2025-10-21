import { TurboEngine } from '../src/models/turbo-engine';
import { DieselCar } from '../src/models/diesel-car';
import { ElectricCar } from '../src/models/electric-car';
import { ElectricMotor } from '../src/models/electric-motor';
import { expect } from 'chai';

describe('Vehicle tests', () => {
    it('getInfo() should return brand and model', () => {
        const car = new DieselCar('BMW', 'X5', new TurboEngine());
        const info = car.getInfo();
        expect(info).to.equal('BMW X5');
    });

    it('getEngineInfo() should include engine type', () => {
        const car = new ElectricCar('Tesla', 'Model 3', new ElectricMotor());
        const info = car.getEngineInfo();
        expect(info).to.include('Electric Motor');
    });
});
