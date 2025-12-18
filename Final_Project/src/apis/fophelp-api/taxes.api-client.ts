import { IApiService } from '../../services/abstractions/i-api-service';
import { TaxesDto } from '../../models/fophelp-api/taxes.dto';

export class TaxesApiClient {
    public constructor(
        private readonly apiService: IApiService<Response>,
        private readonly apiVersion: string
    ) {}

    public async getTaxes(): Promise<[Response, TaxesDto[]]> {
        const response = await this.apiService.get(`${this.apiVersion}/taxes`);
        if (!response.ok) {
            throw new Error(`Failed to get taxes: ${response.statusText}`);
        }
        const taxesResponse = await response.json() as TaxesDto[];
        return [response, taxesResponse];
    }
}
