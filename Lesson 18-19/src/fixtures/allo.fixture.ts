import { test as base } from '@playwright/test';
import { AlloPage } from '../pages/allo.page';

export interface AlloFixtures {
    alloPage: AlloPage;
};

export const test = base.extend<AlloFixtures>({
    alloPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const alloPage = new AlloPage(page);
        await alloPage.openHomepage();

        await use(alloPage);

        await page.close();
        await context.close();
    }
});
