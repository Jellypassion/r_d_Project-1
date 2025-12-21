import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

/**
 * HomePage represents the home/dashboard page after login
 */
export class HomePage extends BasePage {
  // Components
  public readonly header: HeaderComponent;

  // Locators
  private readonly welcomeMessage: Locator;
  private readonly dashboardTitle: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize components
    this.header = new HeaderComponent(page);

    // Initialize locators (adjust selectors based on actual page structure)
    this.welcomeMessage = this.page.locator('.welcome-message, h1, [data-testid="welcome"]');
    this.dashboardTitle = this.page.locator('h1, h2, [data-testid="dashboard-title"]');
  }

  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }

  /**
   * Get dashboard title
   */
  async getDashboardTitle(): Promise<string> {
    return await this.dashboardTitle.textContent() || '';
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.header.waitForVisible(5000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageReady(): Promise<void> {
    await this.waitForPageLoad();
    await this.header.waitForVisible();
  }
}
