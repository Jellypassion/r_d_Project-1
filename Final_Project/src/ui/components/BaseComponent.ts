import { Page, Locator } from '@playwright/test';

/**
 * BaseComponent class provides common functionality for all component objects
 */
export abstract class BaseComponent {
  protected page: Page;
  protected rootLocator: Locator;

  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.rootLocator = page.locator(rootSelector);
  }

  /**
   * Wait for component to be visible
   */
  async waitForVisible(timeout: number = 10000): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if component is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.rootLocator.isVisible();
  }

  /**
   * Get root locator
   */
  getRootLocator(): Locator {
    return this.rootLocator;
  }

  /**
   * Find element within component
   */
  protected locator(selector: string): Locator {
    return this.rootLocator.locator(selector);
  }

  /**
   * Click on element within component
   */
  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill input field within component
   */
  protected async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Get text content from element within component
   */
  protected async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }
}
