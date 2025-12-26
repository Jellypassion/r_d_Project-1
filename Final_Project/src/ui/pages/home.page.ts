import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class HomePage extends BasePage {
  public readonly header: HeaderComponent;

  private readonly mainContent: Locator;
  private readonly homeTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(page);

    this.mainContent = this.page.locator('.main-content');
    this.homeTitle = this.page.locator('.home-title');
  }

  async goto(): Promise<void> {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  async getHomeTitle(): Promise<string> {
    return await this.homeTitle.textContent() || '';
  }

  async isHeaderDisplayed(): Promise<boolean> {
    try {
      await this.header.waitForVisible(5000);
      return true;
    } catch {
      return false;
    }
  }
  async waitForPageReady(): Promise<void> {
    await this.waitForPageLoad();
    await this.header.waitForVisible();
  }
}
