import { BeforeAll } from '@cucumber/cucumber';
import { RobotDreamsWorld } from '../worlds/rd.world.ts';

export function globalContextHook(): void {
    BeforeAll(function() {
        RobotDreamsWorld.globalContext = new Map();
    });
}
