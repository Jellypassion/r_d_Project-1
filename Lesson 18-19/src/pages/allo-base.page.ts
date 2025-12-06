import { Locator, Page } from '@playwright/test';
import { CatalogComponent } from '../components/catalog.component';

export class AlloBasePage {

    public async openHomepage(): Promise<void> {
        await this.page.goto(this._url);
    }

    public getTitle(): Promise<string> {
        return this.page.title();
    }

    public get catalogButton(): Locator {
        return this.page.locator('.mh-catalog-btn .ct-button');
    }

    public openCatalog(): Promise<void> {
        return this.catalogButton.click();
    }

    // Catalog component - call openCatalog() first to display the catalog menu
    public readonly CatalogComponent: CatalogComponent;

    public get page(): Page {
        return this._page;
    }

    public constructor(private readonly _page: Page, private readonly _url = 'https://allo.ua/') {
        this.CatalogComponent = new CatalogComponent(this._page.locator('div>ul.mm__list'));
    }


    public get electricAutoCategoryLink(): Locator {
        return this.page.locator('//li[@class="mm__item"]/a[@href="https://allo.ua/ua/elektromobili/"]');
    }

    public get manufacturerXiaomiCheckbox(): Locator {
        return this.page.locator('a[data-id="1822"]');
    }

    public get priceAscOption(): Locator {
        return this.page.locator('li[data-value="price:asc"]');
    }

    public sortByDropdown(): Locator {
        return this.page.locator('div.a-select__container');
    }

    private get searchInput(): Locator {
        return this.page.locator('input#search-form__input');
    }

    private get searchButton(): Locator {
        return this.page.locator('button.search-form__submit-button');
    }

    public async searchFor(query: string): Promise<void> {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }

    public get searchResults(): Locator {
        return this.page.locator('//div[@class="v-catalog__products"]');
    }

    public async getSearchResultsItems(): Promise<Locator[]> {
        return await this.page
            .locator('//div[@class="products-layout__container products-layout--grid products-layout--is-tab-grid"]/div')
            .all();
    }

    public async getCatalogProductsPrisesTexts(): Promise<(null | string)[]> {
        const priceLocators = this.page.locator('//div[@class="products-layout__container products-layout--grid products-layout--is-tab-grid"]/div//span[@class="sum"]');
        const count = await priceLocators.count();
        const prices = [];
        for (let i = 0; i < count; i++) {
            prices.push(await priceLocators.nth(i).textContent());
        }
        return prices;
    }
}
