import { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
  protected page: Page;
  protected rootLocator: Locator;

  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.rootLocator = page.locator(rootSelector);
  }

  async waitForVisible(timeout: number = 10000): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout });
  }

  async isVisible(): Promise<boolean> {
    return await this.rootLocator.isVisible();
  }

  getRootLocator(): Locator {
    return this.rootLocator;
  }

  protected locator(selector: string): Locator {
    return this.rootLocator.locator(selector);
  }

  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  protected async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  protected async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }
}
