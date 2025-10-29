import { Vehicle } from './vehicle';
import { IEngine } from '../interfaces/i-engine';

export class ElectricCar extends Vehicle {
    private _batteryLevel = 100;

    public constructor(brand: string, model: string, engine: IEngine) {
        super(brand, model, engine);
    }

    public drive(): void {
        if (this._batteryLevel === 0) {
            console.log(`${this._brand} ${this._model} — the battery is discharged!`);
            return;
        }
        this._engine.start();
        console.log(`${this._brand} ${this._model} rides quietly on electric power.`);
        this._batteryLevel -= 10;
    }

    public charge(): void {
        console.log(`Charging ${this._brand} ${this._model}...`);
        this._batteryLevel = 100;
    }

    public reenergize(): void {
        this.charge();
    }

    public getBatteryStatus(): number {
        return this._batteryLevel;
    }
}
