import { expect } from 'chai';
import { ElectricMotor } from 'src/models/electric-motor';
import { TurboEngine } from 'src/models/turbo-engine';

describe('Engine tests', () => {
    it('TurboEngine should return correct efficiency', () => {
        const engine = new TurboEngine();
        const result = engine.getEfficiency();
        expect(result).to.equal(70);
    });

    it('ElectricMotor should return correct efficiency', () => {
        const engine = new ElectricMotor();
        const result = engine.getEfficiency();
        expect(result).to.equal(85);
    });

    it('TurboEngine toString should include "Turbo Engine"', () => {
        const engine = new TurboEngine();
        const toString = engine.toString();
        expect(toString).to.include('Turbo Engine');
    });

    it('ElectricMotor toString should include "Electric Motor"', () => {
        const engine = new ElectricMotor();
        const toString = engine.toString();
        expect(toString).to.include('Electric Motor');
    });
});
