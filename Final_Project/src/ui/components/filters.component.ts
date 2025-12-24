import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class FiltersComponent extends BaseComponent {
  private readonly addIncomeButton: Locator;

  constructor(page: Page) {
    super(page, 'div.filters-section');
    this.addIncomeButton = this.locator('button.add-button');
  }

  async clickAddIncome(): Promise<void> {
    await this.addIncomeButton.click();
  }
}
