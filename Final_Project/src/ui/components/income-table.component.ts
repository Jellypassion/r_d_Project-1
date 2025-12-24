import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class IncomeTableComponent extends BaseComponent {
    private readonly monthGroupLocator: Locator;
    private readonly dateCellLocator: Locator;
    private readonly amountCellLocator: Locator;
    private readonly currencyCellLocator: Locator;
    private readonly cashCellLocator: Locator;
    private readonly commentCellLocator: Locator;

    constructor(page: Page) {
        super(page, 'div.income-table-container');
        this.monthGroupLocator = this.locator('div.month-group');
        this.dateCellLocator = this.locator('td.date-cell');
        this.amountCellLocator = this.locator('td.amount-cell');
        this.currencyCellLocator = this.locator('td.currency-cell');
        this.cashCellLocator = this.locator('td.cash-cell');
        this.commentCellLocator = this.locator('td.comment-cell');
    }

    async getMonthGroupByMonthYear(monthYear: string): Promise<Locator> {
        return this.monthGroupLocator.filter({ hasText: monthYear });
    }

    getDateCell(row: Locator): Locator {
        return row.locator('td.date-cell');
    }

    getAmountCell(row: Locator): Locator {
        return row.locator('td.amount-cell');
    }

    getCurrencyCell(row: Locator): Locator {
        return row.locator('td.currency-cell');
    }

    getCashCell(row: Locator): Locator {
        return row.locator('td.cash-cell');
    }

    async getRecordCountByMonthYear(monthYear: string): Promise<number> {
        const monthGroup = await this.getMonthGroupByMonthYear(monthYear);
        return (await monthGroup.locator('tr').count()) - 1; // exclude header row
    }

    async getRecordsCountFromInnerTableValue(monthYear: string): Promise<number> {
        const monthGroup = await this.getMonthGroupByMonthYear(monthYear);
        const countText = await monthGroup.locator('span.records-count').textContent();
        if (!countText) return 0;

        // Extract number after "Записів: "
        const match = countText.trim().match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    async getTotalMonthIncomeValue(monthYear: string): Promise<number> {
        const monthGroup = await this.getMonthGroupByMonthYear(monthYear);
        const totalText = await monthGroup.locator('span.total-amount').textContent();
        if (!totalText) return 0;
        const match = totalText.match(/[\d\s,]+/);
        if (!match) return 0;

        const numberString = match[0].replace(/\s/g, '').replace(',', '.');
        return parseFloat(numberString);
    }

    getRowByText(text: string): Locator {
        return this.locator(`tbody tr:has-text("${text}")`);
    }

    getRowByDate(date: string): Locator {
        return this.locator(`tbody tr:has(.date-cell:text("${date}"))`);
    }

    getRowByComment(comment: string): Locator {
        return this.locator(`tbody tr:has(.comment-cell:text("${comment}"))`);
    }

    getEditButton(row: Locator): Locator {
        return row.locator('.modify-btn');
    }

    getDeleteButton(row: Locator): Locator {
        return row.locator('.delete-btn');
    }

    async editRowByComment(comment: string): Promise<void> {
        const row = this.getRowByComment(comment);
        await this.getEditButton(row).click();
    }

    async deleteRowByComment(comment: string): Promise<void> {
        const row = this.getRowByComment(comment);
        this.page.once('dialog', async (dialog) => {
            await dialog.accept();
        });
        await this.getDeleteButton(row).click();
    }

    async getAllComments(): Promise<string[]> {
        const commentCells = this.locator('tbody .comment-cell');
        return await commentCells.allTextContents();
    }

    // Extract max number after # in comments
    async getMaxCommentNumber(): Promise<number> {
        const comments = await this.getAllComments();
        const numbers = comments
            .map((comment) => {
                const match = comment.match(/#(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            })
            .filter((num) => !isNaN(num));

        return numbers.length > 0 ? Math.max(...numbers) : 0;
    }

    // Generate next comment with incremented number
    async getNextComment(prefix: string = 'Test income #'): Promise<string> {
        const maxNumber = await this.getMaxCommentNumber();
        return `${prefix}${maxNumber + 1}`;
    }
}
