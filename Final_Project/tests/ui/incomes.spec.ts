import { test, expect } from 'src/ui/fixtures/fophelp.fixture';
import { IncomesPage } from 'src/ui/pages/incomes.page';

test.describe('Incomes page tests', () => {
    let incomesPage: IncomesPage;
    let page: any;

    test.beforeEach(async ({ authenticatedContext }) => {
        page = await authenticatedContext.context.newPage();
        incomesPage = new IncomesPage(page);
        await incomesPage.goto();
    });

    test.afterEach(async () => {
        await page.close();
    });
    test('should display incomes page with all components', async () => {
        const title = await incomesPage.getTitle();
        console.log(`page title: ${title}`);
        expect(title).toBe('FopHELP - помічник у веденні ФОП');
        // Verify that page name is correct
        const pageName = await incomesPage.header.getPageName();
        expect(pageName).toBe('Прибутки');
        // Verify that header is visible
        await incomesPage.header.waitForVisible();
        const headerVisible = await incomesPage.header.isVisible();
        expect(headerVisible).toBeTruthy();
        // Verify that filters component is visible
        await incomesPage.filters.waitForVisible();
        const filtersVisible = await incomesPage.filters.isVisible();
        expect(filtersVisible).toBeTruthy();
        // Verify that income table component is visible
        await incomesPage.incomeTable.waitForVisible();
        const incomeTableVisible = await incomesPage.incomeTable.isVisible();
        expect(incomeTableVisible).toBeTruthy();
        await page.close();
    });

    test('should add a new income entry', async () => {
        const comment = `Comment to test record count ${Date.now()}`;
        const incomeData = {
            date: '05.12.2025',
            currency: 'UAH' as const,
            amount: '1100',
            comment: comment,
            cash: false,
            noIncome: false
        };
        await incomesPage.addIncome(incomeData);

        // Wait for the new row to appear
        const incomeRow = incomesPage.incomeTable.getRowByComment(comment);
        await expect(incomeRow).toBeVisible({ timeout: 10000 });

        // Store all cell locators
        const amountCell = incomesPage.incomeTable.getAmountCell(incomeRow);
        const currencyCell = incomesPage.incomeTable.getCurrencyCell(incomeRow);
        const dateCell = incomesPage.incomeTable.getDateCell(incomeRow);
        const cashCell = incomesPage.incomeTable.getCashCell(incomeRow);

        // Verify cell values with proper waits
        await expect(amountCell).toHaveText('1 100,00', { timeout: 10000 });
        await expect(currencyCell).toHaveText('₴ UAH', { timeout: 10000 });
        await expect(dateCell).toHaveText('05.12.2025', { timeout: 10000 });
        await expect(cashCell).toHaveText('💳 Ні', { timeout: 10000 });
    });

    test('added income should change the number of records and total amount inside the month table', async () => {
        const initialRecordCountForMonth = await incomesPage.getDisplayedRecordsCountForMonth('жовтень 2025');
        const initialTotalAmountForMonth = await incomesPage.getTotalIncomeForMonth('жовтень 2025');
        console.log(`number of records: ${initialRecordCountForMonth} \n total: ${initialTotalAmountForMonth}`);
        const comment = `Comment to test record count ${Date.now()}`;
        const incomeData = {
            date: '05.10.2025',
            currency: 'UAH' as const,
            amount: '500',
            comment: comment,
            cash: false,
            noIncome: false
        };
        await incomesPage.addIncome(incomeData);
        const incomeRow = incomesPage.incomeTable.getRowByComment(comment);
        await expect(incomeRow).toBeVisible({ timeout: 10000 });

        const expectedNewRecordCountForMonth = await incomesPage.getRecordCountForMonth('жовтень 2025');
        const expectedNewTotalAmountForMonth = initialTotalAmountForMonth + Number(incomeData.amount);
        // prettier-ignore
        expect(await incomesPage.getDisplayedRecordsCountForMonth('жовтень 2025'))
            .toBe(expectedNewRecordCountForMonth);
        // prettier-ignore
        expect(await incomesPage.getTotalIncomeForMonth('жовтень 2025'))
            .toBe(expectedNewTotalAmountForMonth);
    });

    test('should be able to edit income entry', async () => {
        const comment = `Test income ${Date.now()}`;
        const incomeData = {
            date: '05.11.2025',
            currency: 'UAH' as const,
            amount: '100',
            comment: comment,
            cash: false,
            noIncome: false
        };
        await incomesPage.addIncome(incomeData);

        const updatedIncomeData = {
            date: '07.11.2025',
            currency: 'USD' as const,
            amount: '200',
            comment: `Updated ${comment}`,
            cash: true
        };
        await incomesPage.editIncome(comment, updatedIncomeData);

        // Wait for the updated row to appear by waiting for it to be visible
        const incomeRow = incomesPage.incomeTable.getRowByComment(updatedIncomeData.comment!);
        await expect(incomeRow).toBeVisible({ timeout: 10000 });

        // Store all cell locators
        const amountCell = incomesPage.incomeTable.getAmountCell(incomeRow);
        const currencyCell = incomesPage.incomeTable.getCurrencyCell(incomeRow);
        const dateCell = incomesPage.incomeTable.getDateCell(incomeRow);
        const cashCell = incomesPage.incomeTable.getCashCell(incomeRow);

        // Wait for all cells to have the expected values with longer timeout
        await expect(currencyCell).toHaveText('$ USD', { timeout: 10000 });
        await expect(amountCell).toHaveText('200,00', { timeout: 10000 });
        await expect(dateCell).toHaveText('07.11.2025', { timeout: 10000 });
        await expect(cashCell).toHaveText('💵 Так', { timeout: 10000 });
    });

    test('should be able to delete income entry', async () => {
        const comment = `Test income to delete ${Date.now()}`;
        const incomeData = {
            date: '07.09.2025',
            currency: 'EUR' as const,
            amount: '300',
            comment: comment,
            cash: false,
            noIncome: false
        };
        await incomesPage.addIncome(incomeData);
        await incomesPage.incomeTable.waitForVisible();

        expect(await incomesPage.isIncomeDisplayed(comment)).toBeTruthy();

        await incomesPage.deleteIncome(comment);

        await incomesPage.waitForPageLoad();
        await incomesPage.incomeTable.waitForVisible();
        await page.waitForTimeout(1000);

        expect(await incomesPage.isIncomeDisplayed(comment)).toBeFalsy();
    });
});
