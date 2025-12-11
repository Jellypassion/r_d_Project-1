import { expect } from '@playwright/test';
import { test } from '../src/fixtures/allo.fixture';

test.describe('Allo page tests', () => {
    test('should have page title containing "АЛЛО"', async ({ alloPage }) => {
        const title = await alloPage.getTitle();
        expect(title).toEqual('АЛЛО - національний маркетплейс із найширшим асортиментом');
    });

    test('should perform a search and show results', async ({ alloPage }) => {
        await alloPage.searchFor('IPhone Air');
        const regex = /\/catalogsearch\/result\/\?q=Iphone%20Air/i;
        await alloPage.page.waitForURL(regex);
        expect(await alloPage.getTitle()).toContain('IPhone Air');
        await expect(alloPage.searchResults).toBeVisible({ timeout: 10_000 });
        const itemCount = (await alloPage.getSearchResultsItems()).length;
        expect(itemCount).toBeGreaterThan(0);
    });

    test('should select an electric car manufacturer and sort models by price', async ({ alloPage }) => {
        await alloPage.catalogButton.click();
        await alloPage.electricAutoCategoryLink.click();
        await alloPage.manufacturerXiaomiCheckbox.click();
        await alloPage.page.waitForURL('https://allo.ua/ua/elektromobili/proizvoditel-xiaomi/');
        await alloPage.sortByDropdown().click();
        await alloPage.priceAscOption.click();
        await alloPage.page.waitForURL('https://allo.ua/ua/elektromobili/dir-asc/order-price/proizvoditel-xiaomi/');
        const pricesTexts = await alloPage.getCatalogProductsPrisesTexts();
        console.log(pricesTexts);
        const pricesNumbers = pricesTexts.map(text => Number(text!.replace(/[\s\D]/g, '')));
        const sortedPrices = [...pricesNumbers].sort((a, b) => a - b);
        expect(pricesNumbers).toEqual(sortedPrices);
    });
});
