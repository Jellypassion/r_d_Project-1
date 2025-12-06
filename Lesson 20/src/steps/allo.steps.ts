import { Given, Then, When } from '@cucumber/cucumber';
import { RobotDreamsWorld } from '../worlds/rd.world.ts';
import { expect } from 'chai';

Given('user is on the Allo.ua homepage', async function (this: RobotDreamsWorld) {
    await this.alloPage.openHomepage();
    // const workerId = process.env.CUCUMBER_WORKER_ID ? parseInt(process.env.CUCUMBER_WORKER_ID) : 0;
    // console.log(`Worker ID: ${workerId}`);
});

When('user searches for {string}', async function (this: RobotDreamsWorld, searchTerm: string) {
    await this.alloPage.searchFor(searchTerm);
});

Then('page title contains {string}', async function (this: RobotDreamsWorld, searchTerm: string) {
    const regex = /\/catalogsearch\/result\/\?q=Iphone%20Air/i;
    await page.waitForURL(regex);
    expect(await this.alloPage.getTitle).to.include(searchTerm);
});

Then('search results are displayed', async function (this: RobotDreamsWorld) {
    const itemCount = (await this.alloPage.getSearchResultsItems()).length;
    expect(itemCount).to.be.greaterThan(0);
});

//When user opens the catalog menu
When('user opens the catalog menu', async function (this: RobotDreamsWorld) {
    await this.alloPage.openCatalog();
});

//Then catalog items are displayed
Then('catalog items are displayed', async function (this: RobotDreamsWorld) {
    const catalogItems = await this.alloPage.CatalogComponent.getCatalogItems();
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
        const itemIsFound = catalogItems.some(async (item) => (await item === expectedItem));
        expect(itemIsFound, `Catalog item "${expectedItem}" should be displayed`).to.be.true;
    }
});
