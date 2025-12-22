import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent, AddIncomePopup } from '../components';

export class IncomesPage extends BasePage {
  public readonly header: HeaderComponent;
  public readonly addIncomePopup: AddIncomePopup;

  private readonly incomesList: Locator;
  private readonly addIncomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.incomesList = this.page.locator('');
    this.addIncomeButton = this.page.locator('button.add-button');

    this.addIncomePopup = new AddIncomePopup(page);
  }

  async goto(): Promise<void> {
    await super.goto('/incomes');
    await this.waitForPageLoad();
  }

  async getIncomesCount(): Promise<number> {
    return await this.incomesList.locator('tr').count();
  }
}