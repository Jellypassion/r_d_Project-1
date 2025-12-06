import { World } from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { AlloPage } from '../pages/allo.page.ts';
// import { ConfigService } from '../services/config.service.ts';

export class RobotDreamsWorld extends World {
    public static globalContext: Map<string, unknown> = new Map<string, unknown> ();

    // we can create a context class that will have its set and get methods for better readability
    public scenarioContext: Map<string, unknown>;

    public static browser: Browser;// поле статичне, тому що браузер один на всі тести
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

    // service getters
    // public get configService(): ConfigService {
    //     if (!this._configService) {
    //         this._configService = new ConfigService();
    //     }
    //     return this._configService;
    // }

    // public get atlassianLoginPage(): AtlassianLoginPage {
    //     if (!this._atlassianLoginPage) {
    //         this._atlassianLoginPage = new AtlassianLoginPage(this.page, this.configService);
    //     }
    //     return this._atlassianLoginPage;
    // }


    // services
    // private _configService: ConfigService;

    public constructor(options: IWorldOptions) {
        super(options);
        this.scenarioContext = new Map<string, unknown>();
    }
}
