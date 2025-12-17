
export interface IncomeDTO {
    income: number;
    id: string;
    dt: string;
    userID: string;
    comment: string;
    type: string | null;
    currency: string;
    cash: boolean;
    taxPayed: boolean;
}

export interface AddIncomeRequest {
    income: string;
    date: string;
    comment: string;
    currency: string;
    cash: boolean;
}

export interface AddIncomeResponse {
    message: string;
    id: string;
}
