import { test, expect } from 'src/ui/fixtures/fophelp.fixture';
import { IncomesPage } from 'src/ui/pages/incomes.page';

test.describe('Incomes page tests', () => {
    test('should display incomes page with all components', async ({ authenticatedContext }) => {
        const page = await authenticatedContext.context.newPage();
        const incomesPage = new IncomesPage(page);
        await incomesPage.goto();

        const title = await incomesPage.getTitle();
        console.log(`page title: ${title}`);
        expect(title).toBe('FopHELP - помічник у веденні ФОП');

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

    test('should add a new income entry', async ({ authenticatedContext }) => {
        const page = await authenticatedContext.context.newPage();
        const incomesPage = new IncomesPage(page);
        await incomesPage.goto();

        const incomeData = {
            date: '03.12.2025',
            currency: 'UAH' as const,
            amount: '1600',
            cash: false,
            noIncome: false
        };
        const comment = await incomesPage.addIncomeWithNextComment(incomeData);
        // const comment = `Test income ${Date.now()}`; // Unique timestamp
        // // Or use: const comment = `Test income ${crypto.randomUUID()}`;
        // await incomesPage.addIncome({ ...incomeData, comment });

        const incomeRow = await incomesPage.incomeTable.getRowByComment(comment);
        expect(incomesPage.incomeTable.getAmountCell(incomeRow)).toHaveText('1 600,00');
        expect(incomesPage.incomeTable.getCurrencyCell(incomeRow)).toHaveText('₴ UAH');
        expect(incomesPage.incomeTable.getDateCell(incomeRow)).toHaveText('03.12.2025');
        expect(incomesPage.incomeTable.getCashCell(incomeRow)).toHaveText('💳 Ні');
    });
});
