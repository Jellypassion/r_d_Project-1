import { describe, it, expect, beforeAll } from 'vitest';
import { FophelpApiClient } from '../../src/helpers/fophelp-client';

describe('Fophelp API Tests', () => {
    let apiClient: FophelpApiClient;

    beforeAll(async () => {
        apiClient = new FophelpApiClient();
        await apiClient.ensureAuthenticated();
    });

    it('should be able to add income', async () => {
        const response = await apiClient.incomesApi.addIncome('1002', '2025-11-05', 'Test income', 'UAH', false);
        console.log(response.message);
        expect(response).toBeDefined();
        expect(response.message).toContain('Successfully created income');
        expect(response.id).toMatch(/^[a-f0-9-]{36}$/); // UUID format
    });

    it('should be able to get incomes', async () => {
        const [response, incomes] = await apiClient.incomesApi.getIncomes();
        console.log(incomes);
        expect(response.ok).toBe(true);
        expect(Array.isArray(incomes)).toBe(true);
        expect(incomes.length).toBeGreaterThan(0);
        expect(Object.keys(incomes[0])).toEqual(
            expect.arrayContaining(['income', 'id', 'dt', 'userID', 'comment', 'type', 'currency', 'cash', 'taxPayed'])
        );
    });
});
