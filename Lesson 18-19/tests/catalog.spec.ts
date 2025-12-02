import { test, BrowserContext, Page } from '@playwright/test';
import { AlloPage } from '../src/pages/allo.page';

test.describe('Catalog component tests', () => {
    let context: BrowserContext;
    let page: Page;
    let alloPage: AlloPage;

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

    test('check that catalog contains expected items', async () => {
        await alloPage.openCatalog();
        const catalogItems = await alloPage.CatalogComponent.getCatalogItems();
        const expectedItems = [
            'Тримай заряд',
            'Електричні авто',
            'Смартфони та телефони',
            'Xiaomi',
            'Apple',
            'Телевізори та мультимедіа',
            'Побутова техніка',
            'Ноутбуки, ПК та планшети',
            'Товари для геймерів',
            'Смарт-годинники і гаджети',
            'Аудіо'
        ];
        for (const expectedItem of expectedItems) {
            test.expect(catalogItems).toContain(expectedItem);
        }
    });

    test('click on the "Тримай заряд" catalog item and verify navigation', async () => {
        await alloPage.openCatalog();
        test.expect(await alloPage.CatalogComponent.getCatalogItems()).toContain('Тримай заряд');
        await alloPage.CatalogComponent.clickCatalogItem('Тримай заряд');
        // wait for navigation to complete
        await page.waitForURL('**/al-ternativnye-istochniki-jenergii/');
        const bcText = (await page.locator('span.b-crumbs__link').textContent())?.trim() ?? '';
        test.expect(bcText).toContain('Альтернативні джерела енергії');
    });
});
