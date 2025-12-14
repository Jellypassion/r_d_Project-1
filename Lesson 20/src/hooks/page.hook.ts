import { After, Before } from '@cucumber/cucumber';
import { RobotDreamsWorld } from '../worlds/rd.world.ts';

export function pageHook(): void {
    Before(async function(this: RobotDreamsWorld) {
        this.page = await this.context?.newPage();
    });

    After(async function(this: RobotDreamsWorld) {
        await this.page?.close();
    });
}
