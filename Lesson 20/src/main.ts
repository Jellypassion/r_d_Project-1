import { setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { RobotDreamsWorld } from './worlds/rd.world.ts';

setDefaultTimeout(999999999);
setWorldConstructor(RobotDreamsWorld);
