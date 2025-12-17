export interface TaxesDto {
    id: string;
    userId: string;
    sumIncomes: number;
    sumExpenses: number;
    amountEP: number;
    amountPDV: number;
    amountESV: number;
    dtFrom: string;
    dtTo: string;
    comment: string;
    taxPayed: boolean;
    amountMilitaryTax: number;
}
