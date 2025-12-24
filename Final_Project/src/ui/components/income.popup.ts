import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class IncomePopup extends BaseComponent {

    //locators
    private readonly closeButton: Locator;
    private readonly dateInput: Locator;
    private readonly currencyDropdown: Locator;
    private readonly incomeAmountInput: Locator;
    private readonly amountErrorMessage: Locator;
    private readonly currencySymbol: Locator;
    private readonly noIncomeForMonthCheckbox: Locator;
    private readonly cashCheckbox: Locator;
    private readonly commentField: Locator;
    private readonly commentErrorMessage: Locator;
    private readonly cancelButton: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page, 'div.modal-content');

        this.closeButton = this.locator('button.modal-close');
        this.dateInput = this.locator('input#date');
        this.currencyDropdown = this.locator('select#currency');
        this.incomeAmountInput = this.locator('input#amount');
        this.amountErrorMessage = this.locator('div.amount-input-wrapper + span.error-message');
        this.currencySymbol = this.locator('.amount-input-wrapper > .currency-symbol'); // ₴
        this.noIncomeForMonthCheckbox = this.locator('label:has-text("За звітний місяць не було доходу") input[type="checkbox"]');
        this.cashCheckbox = this.locator('label:has-text("Готівкові кошти") input[type="checkbox"]');
        this.commentField = this.locator('textarea#comment');
        this.commentErrorMessage = this.commentField.locator('xpath=following-sibling::span.error-message');
        this.cancelButton = this.locator('button:has-text("Скасувати")');
        this.saveButton = this.locator('button:has-text("Додати"), button:has-text("Зберегти")');

    }

    async fillDateFromDDMMYYYY(date: string): Promise<void> {
        // Convert from DD.MM.YYYY to YYYY-MM-DD
        const [day, month, year] = date.split('.');
        const formattedDate = `${year}-${month}-${day}`;
        await this.dateInput.fill(formattedDate);
    }

    async selectCurrency(currency: 'UAH' | 'USD' | 'EUR'): Promise<void> {
        await this.currencyDropdown.selectOption({ value: currency });
    }

    async fillIncomeAmount(amount: string): Promise<void> {
        await this.incomeAmountInput.fill(amount);
    }

    async isIncomeAmountDisabled(): Promise<boolean> {
        return await this.incomeAmountInput.isDisabled();
    }

    async getCurrencySymbol(): Promise<string> {
        return await this.getText(this.currencySymbol);
    }

    async checkNoIncomeForMonth(): Promise<void> {
        if (!(await this.noIncomeForMonthCheckbox.isChecked())) {
            return this.noIncomeForMonthCheckbox.check();
        }
    }

    async uncheckNoIncomeForMonth(): Promise<void> {
        if (await this.noIncomeForMonthCheckbox.isChecked()) {
            return this.noIncomeForMonthCheckbox.uncheck();
        }
    }

    async checkCash(): Promise<void> {
        if (!(await this.cashCheckbox.isChecked())) {
            return this.cashCheckbox.check();
        }
    }

    async uncheckCash(): Promise<void> {
        if (await this.cashCheckbox.isChecked()) {
            return this.cashCheckbox.uncheck();
        }
    }

    async fillComment(comment: string): Promise<void> {
        await this.commentField.fill(comment);
    }

    async clickCancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async clickSave(): Promise<void> {
        await this.saveButton.click();
    }

    async clickAdd(): Promise<void> {
        await this.clickSave();
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async waitForHidden() {
        await this.rootLocator.waitFor({ state: 'hidden', timeout: 5000 });
    }
}
