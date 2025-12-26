import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

type AuthView = 'login' | 'register';

export class AuthPopup extends BaseComponent {
    private currentView: AuthView = 'login';

    // Common locators
    private readonly closeButton: Locator;

    // Login view locators
    private readonly loginEmailInput: Locator;
    private readonly loginPasswordInput: Locator;
    private readonly loginSubmitButton: Locator;
    private readonly forgotPasswordLink: Locator;
    private readonly loginErrorMessage: Locator;
    private readonly registerLink: Locator;

    // Register view locators
    private readonly registerEmailInput: Locator;
    private readonly registerPasswordInput: Locator;
    private readonly registerConfirmPasswordInput: Locator;
    private readonly passwordRequirementsSection: Locator;
    private readonly fopSettingsSection: Locator;
    private readonly fopGroupSelect: Locator;
    private readonly vatCheckbox: Locator;
    private readonly generalTaxationSystemCheckbox: Locator;
    private readonly recaptchaCheckbox: Locator;
    private readonly registerSubmitButton: Locator;
    private readonly loginLink: Locator;

    constructor(page: Page) {
        super(page, 'div:has(> form[class*="modal-form"])');

        // Common
        this.closeButton = this.rootLocator.locator('button[aria-label="Close modal"]');

        // Login view
        this.loginEmailInput = this.locator('#login-email');
        this.loginPasswordInput = this.locator('#login-password');
        this.loginSubmitButton = this.locator('.login-submit-button');
        this.forgotPasswordLink = this.locator('.login-forgot > button');
        this.loginErrorMessage = this.locator('.login-error-alert');
        this.registerLink = this.locator('.login-modal-footer > button');
        // Register view
        this.registerEmailInput = this.locator('input[type="email"]');
        this.registerPasswordInput = this.locator('input[placeholder="Мінімум 8 символів"]');
        this.registerConfirmPasswordInput = this.locator('input[placeholder="Повторіть пароль"]');
        this.passwordRequirementsSection = this.locator('.password-requirements');
        this.fopSettingsSection = this.locator('.fop-settings');
        this.fopGroupSelect = this.fopSettingsSection.locator('select.register-select');
        this.vatCheckbox = this.fopSettingsSection
            .locator('label.checkbox-label', { has: page.locator('span:has-text("Платник ПДВ")') })
            .locator('input[type="checkbox"]');
        this.generalTaxationSystemCheckbox = this.fopSettingsSection
            .locator('label.checkbox-label', { has: page.locator('span:has-text("ФОП на загальній системі оподаткування")') })
            .locator('input[type="checkbox"]');
        this.registerSubmitButton = this.locator('button[type="submit"]');
        // prettier-ignore
        this.recaptchaCheckbox = this.page
            .frameLocator('iframe[title="reCAPTCHA"]')
            .locator('#recaptcha-anchor');
        this.loginLink = this.locator('register-modal-footer > button');
    }

    setCurrentView(view: AuthView): void {
        this.currentView = view;
    }

    getCurrentView(): AuthView {
        return this.currentView;
    }

    async login(email: string, password: string): Promise<void> {
        if (this.currentView === 'register') {
            await this.switchToLogin();
        }

        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginSubmitButton.click();
    }

    async waitForSuccessfulLogin(): Promise<void> {
        await this.page.waitForFunction(
            () => !document.querySelector('div:has(> form[class*="modal-form"])'),
            { timeout: 10000 }
        );

    }

    async register(
        email: string,
        password: string,
        fopSettings?: { fopGroup: string; isVatPayer: boolean; isGeneralTaxationSystem: boolean }
    ): Promise<void> {
        if (this.currentView === 'login') {
            await this.switchToRegister();
        }

        await this.registerEmailInput.fill(email);
        await this.registerPasswordInput.fill(password);
        await this.registerConfirmPasswordInput.fill(password);
        // prettier-ignore
        if (fopSettings) {
            await this.registerFopSettings(
                fopSettings.fopGroup,
                fopSettings.isVatPayer,
                fopSettings.isGeneralTaxationSystem
            );
        }
        await this.clickRecaptchaCheckbox()
        await this.registerSubmitButton.click();
    }

    async clickRecaptchaCheckbox(): Promise<void> {
        await this.recaptchaCheckbox.click();
        // prettier-ignore
        await this.page.waitForFunction(
            () => document.querySelector('#recaptcha-anchor')?.getAttribute('aria-checked') === 'true',
            { timeout: 10000 }
        );
    }

    async registerFopSettings(fopGroup: string, isVatPayer: boolean, isGeneralTaxationSystem: boolean): Promise<void> {
        await this.fopGroupSelect.selectOption(fopGroup);

        if (isVatPayer) {
            const isChecked = await this.vatCheckbox.isChecked();
            if (!isChecked) {
                await this.vatCheckbox.check();
            }
        }

        if (isGeneralTaxationSystem) {
            const isChecked = await this.generalTaxationSystemCheckbox.isChecked();
            if (!isChecked) {
                await this.generalTaxationSystemCheckbox.check();
            }
        }
    }

    async switchToRegister(): Promise<void> {
        await this.registerLink.click();
        this.currentView = 'register';
    }

    async switchToLogin(): Promise<void> {
        await this.loginLink.click();
        this.currentView = 'login';
    }

    async getLoginErrorMessage(): Promise<string> {
        return (await this.loginErrorMessage.textContent()) || '';
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }
}
