import { test } from '../src/fixtures/allo.fixture';

test.describe('Catalog component tests', () => {

    test('check that catalog contains expected items', async ({ alloPage }) => {
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

    test('click on the "Тримай заряд" catalog item and verify navigation', async ({ alloPage }) => {
        await alloPage.openCatalog();
        test.expect(await alloPage.CatalogComponent.getCatalogItems()).toContain('Тримай заряд');
        await alloPage.CatalogComponent.clickCatalogItem('Тримай заряд');
        await alloPage.page.waitForURL('**/al-ternativnye-istochniki-jenergii/');
        const bcText = (await alloPage.page.locator('span.b-crumbs__link').textContent())?.trim() ?? '';
        test.expect(bcText).toContain('Альтернативні джерела енергії');
    });
});
