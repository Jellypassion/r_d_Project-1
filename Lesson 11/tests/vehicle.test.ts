import {beforeEach, describe, expect, it, vi} from 'vitest';
import { IEngine } from '../src/interfaces/i-engine';
import { DieselCar } from '../src/models/diesel-car';
import { ElectricCar } from '../src/models/electric-car';
import { TurboEngine } from '../src/models/turbo-engine';
import { ElectricMotor } from '../src/models/electric-motor';
import { VehicleService } from '../src/services/vehicle-service';

describe ('Vehicles tests with mocks and spies', () => {
    let diesel: DieselCar;
    let electric: ElectricCar;
    let dieselEngine: IEngine;
    let electricMotor: IEngine;

    beforeEach(() => {
        dieselEngine = new TurboEngine();
        electricMotor = new ElectricMotor();
        diesel = new DieselCar('BMW', 'X5', dieselEngine);
        electric = new ElectricCar('Tesla', 'Model 3', electricMotor);
    });

    it('should spy on engine.start when driving DieselCar', () => {
        const startSpy = vi.spyOn(dieselEngine, 'start');
        diesel.drive();
        expect(startSpy).toHaveBeenCalledOnce();
    });

    it('should stub engine.start to simulate failure', () => {
        const stub = vi.spyOn(dieselEngine, 'start').mockImplementation(() => {
            console.log('Engine failed to start!');
        });

        diesel.drive();
        expect(stub).toHaveBeenCalled();
    });

    it('should use a mocked engine in ElectricCar', () => {
        const mockEngine: IEngine = {
            start: vi.fn(() => console.log('Mock engine start')),
            stop: vi.fn(),
            getEfficiency: vi.fn(() => 100),
            toString: vi.fn(() => 'Mocked Engine (Efficiency: 100%)')
        };

        const mockCar = new ElectricCar('Nissan', 'Leaf', mockEngine);
        mockCar.drive();

        expect(mockEngine.start).toHaveBeenCalledOnce();
        expect(mockEngine.toString()).toContain('100%');
    });

    it('should mock reenergize() in VehicleService', () => {
        const service = new VehicleService();
        const reenergizeMock = vi.spyOn(service, 'reenergize').mockImplementation(() => {
            console.log('Mocked reenergize');
        });

        service.reenergize(electric);
        expect(reenergizeMock).toHaveBeenCalledOnce();
    });

    it('should partially mock refuel() to log custom message', () => {
        const refuelMock = vi.spyOn(diesel, 'refuel').mockImplementation(() => {
            console.log('Mocked refueling process');
        });

        diesel.reenergize();
        expect(refuelMock).toHaveBeenCalledOnce();
    });
});
