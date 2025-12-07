import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { RobotDreamsWorld } from '../worlds/rd.world.ts';
import { expect } from 'chai';

Given('user is on the Allo.ua homepage', async function (this: RobotDreamsWorld) {
    await this.alloPage.openHomepage();
});

When('user searches for {string}', async function (this: RobotDreamsWorld, searchTerm: string) {
    await this.alloPage.searchFor(searchTerm);
});

Then('page title contains {string}', async function (this: RobotDreamsWorld, searchTerm: string) {
    const url = 'https://allo.ua/ua/catalogsearch/result/?q=iPhone%20Air';
    await this.alloPage.page.waitForURL(url);
    const title = await this.alloPage.getTitle();
    expect(title).to.include(searchTerm);
});

Then('search results are displayed', async function (this: RobotDreamsWorld) {
    const itemCount = (await this.alloPage.getSearchResultsItems()).length;
    expect(itemCount).to.be.greaterThan(0);
});

When('user opens the catalog menu', async function (this: RobotDreamsWorld) {
    await this.alloPage.openCatalog();
});

Then('catalog contains the following items:', async function (this: RobotDreamsWorld, items: DataTable) {
    const catalogItems = await this.alloPage.CatalogComponent.getCatalogItems();
    const expectedItems = items.hashes().map(row => row['item']);
    for (const expectedItem of expectedItems) {
        const itemIsFound = catalogItems.some((item) => item === expectedItem);
        expect(itemIsFound, `Catalog item "${expectedItem}" should be displayed`).to.be.true;
    }
});
