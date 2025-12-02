import { Locator } from '@playwright/test';

export class CatalogComponent {
    public constructor(protected readonly baseLocator: Locator) {}

    private get singleCatalogItem(): Locator {
        return this.baseLocator.locator('li.mm__item>a');
    }

    public getSingleCatalogItem(itemName: string): Locator {
        return this.baseLocator.locator(`a:has-text("${itemName}")`);
    }

    public async getCatalogItems(): Promise<string[]> {
        const catalogItems: string[] = [];
        const singleCatalogItems = await this.singleCatalogItem.all();
        for (const item of singleCatalogItems) {
            const textContent = await item.textContent();
            catalogItems.push((textContent || '').trim());
        }
        return catalogItems;
    }

    // on hover the sub-catalog is shown
    public async hoverCatalogItem(itemName: string): Promise<void> {
        const catalogItems = await this.getCatalogItems();
        if (!catalogItems.includes(itemName)) {
            throw new Error(`Catalog does not contain item with name: ${itemName}`);
        }

        const singleCatalogItem = this.getSingleCatalogItem(itemName);
        await singleCatalogItem.hover();
    }

    // on click a page with this catalog section is opened
    public async clickCatalogItem(itemName: string): Promise<void> {
        const catalogItems = await this.getCatalogItems();
        if (!catalogItems.includes(itemName)) {
            throw new Error(`Catalog does not contain item with name: ${itemName}`);
        }
        const singleCatalogItem = this.getSingleCatalogItem(itemName);
        await singleCatalogItem.click();
    }
}
