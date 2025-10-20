import { IEngine } from 'src/interfaces/i-engine';

export class ElectricMotor implements IEngine {
    public start(): void {
        console.log('Electric motor started. It is running silently.');
    }
    public stop(): void {
        console.log('Electric motor stopped');
    }
    public getEfficiency(): number {
        return 85;
    }
}
