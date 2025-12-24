import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent, IncomePopup, FiltersComponent, IncomeTableComponent } from '../components';

export class IncomesPage extends BasePage {
  public readonly header: HeaderComponent;
  public readonly incomePopup: IncomePopup;
  public readonly filters: FiltersComponent;
  public readonly incomeTable: IncomeTableComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.filters = new FiltersComponent(page);
    this.incomeTable = new IncomeTableComponent(page);
    this.incomePopup = new IncomePopup(page);
  }

  async goto(): Promise<void> {
    await super.goto('/incomes');
    await this.waitForPageLoad();
  }

  // ========== Popup operations ==========

  async openAddIncomePopup(): Promise<void> {
    await this.filters.clickAddIncome();
    await this.incomePopup.waitForVisible();
  }

  async openEditIncomePopup(comment: string): Promise<void> {
    await this.incomeTable.editRowByComment(comment);
    await this.incomePopup.waitForVisible();
  }

  // ========== Add Income operations ==========

  async addIncome(data: {
    date: string;
    currency?: 'UAH' | 'USD' | 'EUR';
    amount: string;
    comment: string;
    cash?: boolean;
    noIncome?: boolean;
  }): Promise<void> {
    await this.openAddIncomePopup();
    await this.fillIncomeForm(data);
    await this.incomePopup.clickSave();
    await this.incomePopup.waitForHidden();
  }

  async addIncomeWithNextComment(data: {
    date: string;
    currency?: 'UAH' | 'USD' | 'EUR';
    amount: string;
    commentPrefix?: string;
    cash?: boolean;
    noIncome?: boolean;
  }): Promise<string> {
    const comment = await this.incomeTable.getNextComment(data.commentPrefix || 'Test income #');
    await this.addIncome({
      ...data,
      comment
    });
    return comment;
  }

  // ========== Edit Income operations ==========

  async editIncome(existingComment: string, data: {
    date?: string;
    currency?: 'UAH' | 'USD' | 'EUR';
    amount?: string;
    comment?: string;
    cash?: boolean;
    noIncome?: boolean;
  }): Promise<void> {
    await this.openEditIncomePopup(existingComment);
    await this.fillIncomeForm(data);
    await this.incomePopup.clickSave();
    await this.incomePopup.waitForHidden();
  }

  // ========== Delete Income operations ==========

  async deleteIncome(comment: string): Promise<void> {
    await this.incomeTable.deleteRowByComment(comment);
  }

  // ========== Form filling helper ==========

  private async fillIncomeForm(data: {
    date?: string;
    currency?: 'UAH' | 'USD' | 'EUR';
    amount?: string;
    comment?: string;
    cash?: boolean;
    noIncome?: boolean;
  }): Promise<void> {
    if (data.date) {
      await this.incomePopup.fillDateFromDDMMYYYY(data.date);
    }

    if (data.currency) {
      await this.incomePopup.selectCurrency(data.currency);
    }

    if (data.noIncome !== undefined) {
      if (data.noIncome) {
        await this.incomePopup.checkNoIncomeForMonth();
      } else {
        await this.incomePopup.uncheckNoIncomeForMonth();
      }
    }

    if (data.amount) {
      await this.incomePopup.fillIncomeAmount(data.amount);
    }

    if (data.cash !== undefined) {
      if (data.cash) {
        await this.incomePopup.checkCash();
      } else {
        await this.incomePopup.uncheckCash();
      }
    }

    if (data.comment) {
      await this.incomePopup.fillComment(data.comment);
    }
  }

  // ========== Table verification methods ==========

  async getRecordCountForMonth(monthYear: string): Promise<number> {
    return await this.incomeTable.getRecordCountByMonthYear(monthYear);
  }

  async getDisplayedRecordsCountForMonth(monthYear: string): Promise<number> {
    return await this.incomeTable.getRecordsCountFromInnerTableValue(monthYear);
  }

  async getTotalIncomeForMonth(monthYear: string): Promise<number> {
    return await this.incomeTable.getTotalMonthIncomeValue(monthYear);
  }

  async getAllComments(): Promise<string[]> {
    return await this.incomeTable.getAllComments();
  }

  async isIncomeDisplayed(comment: string): Promise<boolean> {
    return await this.incomeTable.getRowByComment(comment).isVisible();
  }

}