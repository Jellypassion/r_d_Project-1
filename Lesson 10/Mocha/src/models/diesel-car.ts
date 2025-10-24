import { IEngine } from 'src/interfaces/i-engine';
import { Vehicle } from './vehicle';

export class DieselCar extends Vehicle {
    private _fuelLevel = 50;

    public constructor(brand: string, model: string, engine: IEngine) {
        super(brand, model, engine);
    }
    public drive(): void {
        if (this._fuelLevel === 0) {
            console.log(`${this._brand} ${this._model} - Tank is empty!`);
            return;
        }
        this._engine.start();
        console.log(`${this._brand} ${this._model} is driving with a diesel sound`);
        this._speed = 10;
        this._fuelLevel -= 5;
    }

    public refuel(): void {
        console.log(`Refueling ${this._brand} ${this._model} with diesel...`);
        this._fuelLevel = 50;
    }

    public reenergize(): void {
        this.refuel();
    }

    public getFuelLevel(): number {
        return this._fuelLevel;
    }
}
