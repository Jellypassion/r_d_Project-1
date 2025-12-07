import { World } from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { AlloPage } from '../pages/allo.page.ts';

export class RobotDreamsWorld extends World {
    public static globalContext: Map<string, unknown> = new Map<string, unknown> ();

    public scenarioContext: Map<string, unknown>;

    public static browser: Browser;
    public context?: BrowserContext;
    public page?: Page;

    public get browser(): Browser {
        return RobotDreamsWorld.browser;
    }

    public get globalContext(): Map<string, unknown> {
        return RobotDreamsWorld.globalContext;
    }

    // pages
    private _alloPage: AlloPage;

    // pages getters
    public get alloPage(): AlloPage {
        if (!this._alloPage) {
            this._alloPage = new AlloPage(this.page!);
        }
        return this._alloPage;
    }

    public constructor(options: IWorldOptions) {
        super(options);
        this.scenarioContext = new Map<string, unknown>();
    }
}
