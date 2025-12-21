import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage represents the login page of the application
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators (adjust selectors based on actual page structure)
    this.emailInput = this.page.locator('input[type="email"], input[name="email"], input#email');
    this.passwordInput = this.page.locator('input[type="password"], input[name="password"], input#password');
    this.loginButton = this.page.locator('button[type="submit"], button:has-text("Войти"), button:has-text("Login")');
    this.errorMessage = this.page.locator('.error-message, .alert-danger, [role="alert"]');
    this.rememberMeCheckbox = this.page.locator('input[type="checkbox"][name="remember"], input#remember');
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await super.goto('/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Fill email input
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
  }

  /**
   * Fill password input
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Check "Remember me" checkbox
   */
  async checkRememberMe(): Promise<void> {
    if (await this.rememberMeCheckbox.isVisible()) {
      await this.rememberMeCheckbox.check();
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if error message is visible
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Wait for successful login (redirect)
   */
  async waitForSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL('**!/login', { timeout: 10000 });
  }
}
