import { AddIncomeRequest, AddIncomeResponse, IncomeDTO } from "src/models/fophelp-api/incomes.dto";
import { IApiService } from '../../services/abstractions/i-api-service';

export class incomesApiClient {
    public constructor(
        private readonly apiService: IApiService<Response>,
        private readonly apiVersion = '/api/v2.0'
    ) {}

    public async addIncome(income: string, date: string, comment: string, currency: string, cash: boolean): Promise<AddIncomeResponse> {
        const body: AddIncomeRequest = { income, date, comment, currency, cash };

        const response = await this.apiService.post(`${this.apiVersion}/incomes/add`, body);
        const responseText = await response.text();
        return this.parseAddIncomeResponse(responseText);
    }

    private parseAddIncomeResponse(rawResponse: string): AddIncomeResponse {
        const match = rawResponse.match(/ID:\s*([a-f0-9-]+)/i);
        if (!match) {
            throw new Error('Failed to parse income ID from response');
        }
        return {
            message: rawResponse,
            id: match[1]
        };
    }

    public async getIncomes(): Promise<[Response, IncomeDTO[]]> {
        const response = await this.apiService.get(`${this.apiVersion}/incomes`);
        const incomesResponse = await response.json() as IncomeDTO[];
        return [response, incomesResponse];
    }
}
