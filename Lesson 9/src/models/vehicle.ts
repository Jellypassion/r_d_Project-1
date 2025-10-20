import { IEngine } from 'src/interfaces/i-engine';

export abstract class Vehicle {
    protected _brand: string;
    protected _model: string;
    protected _speed = 0;
    protected _engine: IEngine;

    public constructor(brand: string, model: string, engine: IEngine) {
        this._brand = brand;
        this._model = model;
        this._engine = engine;
    }

    public getInfo(): string {
        return `${this._brand} ${this._model}`;
    }

    public abstract drive(): void;
    public abstract reenergize(): void;

    public accelerate(amount: number): void {
        this._speed += amount;
        console.log(`${this._brand} ${this._model} accelerates to ${this._speed} km/h`);
    }

    public getEngineInfo(): string {
        return this._engine.toString();
    }
}
