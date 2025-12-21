import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * HeaderComponent represents the header/navigation bar
 */
export class HeaderComponent extends BaseComponent {
  // Locators
  private readonly logo: Locator;
  private readonly userMenu: Locator;
  private readonly userName: Locator;
  private readonly logoutButton: Locator;
  private readonly navigationItems: Locator;
  private readonly profileLink: Locator;

  constructor(page: Page) {
    // Adjust the root selector based on actual page structure
    super(page, 'header, .header, [data-testid="header"], nav.navbar');
    
    // Initialize locators
    this.logo = this.locator('.logo, [data-testid="logo"], img[alt*="logo"]');
    this.userMenu = this.locator('.user-menu, [data-testid="user-menu"], .dropdown-toggle');
    this.userName = this.locator('.user-name, [data-testid="user-name"], .username');
    this.logoutButton = this.locator('button:has-text("Выйти"), button:has-text("Logout"), a:has-text("Выйти"), a:has-text("Logout")');
    this.navigationItems = this.locator('nav a, .nav-link, [role="menuitem"]');
    this.profileLink = this.locator('a:has-text("Профиль"), a:has-text("Profile"), [href*="profile"]');
  }

  /**
   * Click on logo
   */
  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  /**
   * Get user name from header
   */
  async getUserName(): Promise<string> {
    await this.userName.waitFor({ state: 'visible', timeout: 5000 });
    return await this.getText(this.userName);
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    // Open user menu if needed
    if (await this.userMenu.isVisible()) {
      await this.openUserMenu();
    }
    
    await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutButton.click();
  }

  /**
   * Navigate to profile page
   */
  async goToProfile(): Promise<void> {
    // Open user menu if needed
    if (await this.userMenu.isVisible()) {
      await this.openUserMenu();
    }
    
    await this.profileLink.click();
  }

  /**
   * Get all navigation items text
   */
  async getNavigationItems(): Promise<string[]> {
    const items = await this.navigationItems.all();
    const texts: string[] = [];
    
    for (const item of items) {
      const text = await item.textContent();
      if (text) {
        texts.push(text.trim());
      }
    }
    
    return texts;
  }

  /**
   * Click on navigation item by text
   */
  async clickNavigationItem(itemText: string): Promise<void> {
    await this.navigationItems.filter({ hasText: itemText }).first().click();
  }

  /**
   * Check if user is logged in (header visible)
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      return await this.userName.isVisible() || await this.userMenu.isVisible();
    } catch {
      return false;
    }
  }
}
