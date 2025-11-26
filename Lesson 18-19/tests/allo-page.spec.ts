import { test, expect, BrowserContext, Page } from '@playwright/test';
import { AlloPage } from 'src/pages/allo.page';

let context: BrowserContext;
let page: Page;
let alloPage: AlloPage;

test.describe('Allo page tests', () => {
    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        alloPage = new AlloPage(page);
        await alloPage.openHomepage();
    });

    test.afterEach(async () => {
        await page.close();
        // await context.clearCookies();
        // await context.close();
    });

    test('should have page title containing "Allo"', async () => {
        await expect(page).toHaveTitle('АЛЛО - національний маркетплейс із найширшим асортиментом');
    });

    test('should perform a search and show results', async () => {
        await alloPage.searchFor('IPhone Air');
        // await page.waitForURL('https://allo.ua/ua/catalogsearch/result/?q=IPhone%20Air');
        const regex = /\/catalogsearch\/result\/\?q=Iphone%20Air/i;
        await page.waitForURL(regex);
        console.log(page.url());
        expect(await page.title()).toContain('IPhone Air');
        await expect(alloPage.searchResults).toBeVisible({ timeout: 10_000 });
        const itemCount = (await alloPage.getSearchResultsItems()).length;
        expect(itemCount).toBeGreaterThan(0);
    });

    test('should select an electric car manufacturer and sort models by price', async () => {
        await alloPage.catalogButton.click();
        await alloPage.electricAutoCategoryLink.click();
        await alloPage.manufacturerXiaomiCheckbox.click();
        await page.waitForURL('https://allo.ua/ua/elektromobili/proizvoditel-xiaomi/');
        await alloPage.sortByDropdown().click();
        await alloPage.priceAscOption.click();
        await page.waitForURL('https://allo.ua/ua/elektromobili/dir-asc/order-price/proizvoditel-xiaomi/');
        // verify that sorting is applied
        const pricesTexts = await alloPage.getCatalogProductsPrisesTexts();
        console.log(pricesTexts);
        const pricesNumbers = pricesTexts.map(text => Number(text.replace(/[\s\D]/g, '')));
        const sortedPrices = [...pricesNumbers].sort((a, b) => a - b);
        expect(pricesNumbers).toEqual(sortedPrices);
    });
});
