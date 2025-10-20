import { IEngine } from 'src/interfaces/i-engine';

export class TurboEngine implements IEngine {
    public start(): void {
        console.log('Engine started. It is running loudly.');
    }
    public stop(): void {
        console.log('Engine stopped');
    }
    public getEfficiency(): number {
        return 70;
    }
}
