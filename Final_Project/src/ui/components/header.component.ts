import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';
import { AuthPopup } from './auth.popup';

export class HeaderComponent extends BaseComponent {
    private readonly logo: Locator;
    private readonly pageName: Locator;
    private readonly themeToggleButton: Locator;
    private readonly userName: Locator;
    private readonly signinButton: Locator;
    private readonly registerButton: Locator;
    private readonly userInfo: Locator;
    private readonly userDropdownMenu: Locator;
    private readonly logoutButton: Locator;
    private readonly deleteAccountButton: Locator;
    private readonly navigationItems: Locator;
    private readonly authPopup: AuthPopup;

    constructor(page: Page) {
        super(page, '.sticky-header-nav');

        this.logo = this.locator('.brand-logo');
        this.pageName = this.logo.locator('span.page-name');
        this.themeToggleButton = this.locator('button.theme-toggle');
        this.signinButton = this.locator('.signin-button, button:has-text("Увійти")');
        this.registerButton = this.locator('.register-button, button:has-text("Реєстрація")');
        this.userInfo = this.locator('.user-info');
        this.userName = this.locator('.user-info strong');
        this.userDropdownMenu = this.userInfo.locator('.dropdown-content');
        this.logoutButton = this.userInfo.locator('button:has-text("Вийти")');
        this.deleteAccountButton = this.userInfo.locator('button:has-text("Видалити акаунт")');

        this.navigationItems = this.locator('div.nav-item');

        this.authPopup = new AuthPopup(page);
    }

    async clickLogo(): Promise<void> {
        await this.logo.click();
    }

    async getPageName(): Promise<string> {
        return await this.getText(this.pageName);
    }

    async toggleTheme(): Promise<void> {
        await this.themeToggleButton.click();
    }

    async clickSignin(): Promise<AuthPopup> {
        await this.signinButton.click();
        this.authPopup.setCurrentView('login');
        return this.authPopup;
    }

    async clickRegister(): Promise<AuthPopup> {
        await this.registerButton.click();
        this.authPopup.setCurrentView('register');
        return this.authPopup;
    }

    async getUserName(): Promise<string> {
        await this.userName.waitFor({ state: 'visible', timeout: 5000 });
        return await this.getText(this.userName);
    }

    async openUserDropdownMenu(): Promise<void> {
        if (await this.userInfo.isVisible()) {
            await this.userName.hover();
            await this.userDropdownMenu.waitFor({ state: 'visible', timeout: 5000 });
        }
    }

    async logout(): Promise<void> {
        if (!(await this.userDropdownMenu.isVisible())) {
            await this.openUserDropdownMenu();
        }

        await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.logoutButton.click();
    }

    async deleteAccount(): Promise<void> {
        if (!(await this.userDropdownMenu.isVisible())) {
            await this.openUserDropdownMenu();
        }

        await this.deleteAccountButton.waitFor({ state: 'visible', timeout: 5000 });
        this.page.once('dialog', async (dialog) => {
            await dialog.accept();
        });
        await this.deleteAccountButton.click();
    }

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

    async clickNavigationItem(itemText: string): Promise<void> {
        await this.navigationItems.filter({ hasText: itemText }).first().click();
    }

    async openNavigationItemDropdown(itemText: string): Promise<void> {
        const item = this.navigationItems.filter({ hasText: itemText }).first();
        await item.hover();

        const dropdown = item.locator('.dropdown-menu ');
        await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    }

    async clickNavigationItemDropdownItem(itemText: string, dropdownItemText: string): Promise<void> {
        const item = this.navigationItems.filter({ hasText: itemText }).first();
        await item.hover();

        const dropdown = item.locator('.dropdown-menu');
        await dropdown.waitFor({ state: 'visible', timeout: 5000 });

        await dropdown.locator(`a:has-text("${dropdownItemText}")`).first().click();
    }

    async isUserLoggedIn(): Promise<boolean> {
        try {
            return (await this.userName.isVisible()) || (await this.userInfo.isVisible());
        } catch {
            return false;
        }
    }
}
