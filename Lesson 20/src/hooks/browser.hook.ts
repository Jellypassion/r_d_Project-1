import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { RobotDreamsWorld } from '../worlds/rd.world.ts';

export function browserHook():void {
    BeforeAll(async function() {
        RobotDreamsWorld.browser = await chromium.launch({ headless: false });
    });


    AfterAll(async function() {
        await RobotDreamsWorld.browser.close();
    });
}
